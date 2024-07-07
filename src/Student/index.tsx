import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Button, Form, Input, Modal, Select, Table } from "antd";

interface IPerson {
  Id: number;
  Name: string;
  Age: number;
  Address: string;
  JobId: number;
}

interface IJob {
  Name: string;
  id: number;
}

const Person = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [personData, setPersonData] = useState({
    Id: 0,
    Name: "",
    Age: 0,
    Address: "",
    JobId: 1,
  });
  const [isEdit, setIsEdit] = useState(false);
  const GET_PERSON = gql`
    query personsQuery {
      Person(limit: 10) {
        Address
        Age
        Id
        JobId
        Name
      }
    }
  `;

  const GET_jOB = gql`
    query jobQuery {
      Job(limit: 10) {
        Name
        id
      }
    }
  `;

  const ADD_PERSON = gql`
    mutation personMutation(
      $Address: String!
      $Age: Int!
      $JobId: Int!
      $Name: String
    ) {
      insert_Person(
        objects: { Address: $Address, Age: $Age, JobId: $JobId, Name: $Name }
      ) {
        returning {
          Address
          Age
          Id
          JobId
          Name
        }
      }
    }
  `;

  const showModal = () => {
    setIsOpen(true);
  };

  const handleOk = () => {
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setIsEdit(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "Age",
      dataIndex: "Age",
      key: "Age",
    },
    {
      title: "Address",
      dataIndex: "Address",
      key: "Address",
    },
    {
      title: "Job",
      dataIndex: "JobId",
      key: "JobId",
      render: (jobId: number) => {
        const job = jobQuery?.data?.Job.find((job: IJob) => job.id === jobId);
        return job?.Name ?? "Unknown";
      },
    },
    {
      title: "Action",
      key: "action",
      render: (record: IPerson) => (
        <>
          <Button
            type="primary"
            onClick={() => {
              console.log(record);
              setIsEdit(true);
              showModal();
              setPersonData(record);
            }}
          >
            Edit
          </Button>
          <Button type="primary" onClick={() => console.log(record)}>
            Delete
          </Button>
        </>
      ),
    },
  ];
  const personQuery = useQuery(GET_PERSON);
  const jobQuery = useQuery(GET_jOB);
  const [insert_Person, { data, loading, error }] = useMutation(ADD_PERSON);

  const onFinish = async (data: IPerson) => {
    await insert_Person({
      variables: {
        Address: data.Address,
        Age: data.Age,
        JobId: data.JobId,
        Name: data.Name,
      },
    });
    handleCancel();
    console.log(data);
  };

  const jobOptions = jobQuery?.data?.Job.map((job: IJob) => ({
    label: job.Name,
    value: job.id,
  }));

  return (
    <div>
      <div>
        <Button onClick={showModal}>Add</Button>
      </div>
      <Table columns={columns} dataSource={personQuery?.data?.Person} />
      <Modal
        title="Basic Modal"
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={<></>}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{
            Name: isEdit ? personData.Name : "",
            Age: isEdit ? personData.Age : 0,
            Address: isEdit ? personData.Address : "",
            JobId: isEdit ? personData.JobId : 1,
          }}
          onFinish={onFinish}
          autoComplete="off"
          clearOnDestroy
        >
          <Form.Item<IPerson> label="Name" name="Name">
            <Input />
          </Form.Item>

          <Form.Item<IPerson> label="Age" name="Age">
            <Input />
          </Form.Item>
          <Form.Item<IPerson> label="Address" name="Address">
            <Input />
          </Form.Item>
          <Form.Item<IPerson> label="JobId" name="JobId">
            <Select options={jobOptions || []} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Person;
