import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Button, Form, Input, Modal, Select, Table } from "antd";

interface IPerson {
  Id: number;
  Name: string;
  Age: number;
  Address: string;
  JobId: number | undefined;
}

interface IJob {
  Name: string;
  id: number;
}

const defaultPersonData: IPerson = {
  Id: 0,
  Name: "",
  Age: 0,
  Address: "",
  JobId: 0,
};

const Person = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [personData, setPersonData] = useState(defaultPersonData);
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

  const UPDATE_PERSON = gql`
    mutation editMutaion(
      $Address: String!
      $Age: Int!
      $JobId: Int!
      $Name: String
      $Id: Int!
    ) {
      update_Person(
        where: { Id: { _eq: $Id } }
        _set: { Address: $Address, Age: $Age, JobId: $JobId, Name: $Name }
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

  const DELETE_PERSON = gql`
    mutation deletePersonMutation($Id: Int!) {
      delete_Person(where: { Id: { _eq: $Id } }) {
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
    setPersonData(defaultPersonData);
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
        return job?.Name ?? "";
      },
    },
    {
      title: "Action",
      key: "action",
      render: (record: IPerson) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <Button
            type="primary"
            onClick={() => {
              setPersonData(record);
              setIsEdit(true);
              showModal();
            }}
          >
            Edit
          </Button>
          <Button
            type="primary"
            onClick={async () => {
              await delete_Person({
                variables: {
                  Id: record.Id,
                },
              });
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  const personQuery = useQuery(GET_PERSON);
  const jobQuery = useQuery(GET_jOB);
  const [insert_Person, dataAddPerson] = useMutation(ADD_PERSON, {
    refetchQueries: [GET_PERSON, "personsQuery"],
  });
  const [update_Person, dataEditPerson] = useMutation(UPDATE_PERSON, {
    refetchQueries: [GET_PERSON, "personsQuery"],
  });

  const [delete_Person, dataDeletePerson] = useMutation(DELETE_PERSON, {
    refetchQueries: [GET_PERSON, "personsQuery"],
  });
  console.log(dataEditPerson);
  console.log(dataEditPerson?.data);
  console.log(dataAddPerson);
  console.log(dataDeletePerson);
  const onFinish = async (data: IPerson) => {
    try {
      isEdit
        ? await update_Person({
            variables: {
              Id: personData.Id,
              Address: data.Address,
              Age: data.Age,
              JobId: data.JobId,
              Name: data.Name,
            },
          })
        : await insert_Person({
            variables: {
              Address: data.Address,
              Age: data.Age,
              JobId: data.JobId,
              Name: data.Name,
            },
          });
    } catch (error) {
      console.log(error);
    }
    handleCancel();
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
      <Table
        columns={columns}
        dataSource={personQuery?.data?.Person}
        loading={personQuery?.loading}
      />
      <Modal
        title="Basic Modal"
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={<></>}
        destroyOnClose
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={isEdit ? personData : defaultPersonData}
          onFinish={onFinish}
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
