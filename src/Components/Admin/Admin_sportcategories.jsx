import React, { useEffect, useState } from "react";
import { Table, Space, Typography, Popconfirm, Modal, Form, Input, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Button from "react-bootstrap/Button";
import axios from "axios";

const Admin_sportcategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const response = await axios.get("https://localhost:7250/api/Tblsportcategories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data.data);
    } catch (error) {
      message.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      categoryName: category.categoryname,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    const token = sessionStorage.getItem("token");
    try {
      await axios.delete(`https://localhost:7250/api/Tblsportcategories/${id}`,{
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      message.error("Failed to delete category");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const token = sessionStorage.getItem("token");
      if (editingCategory) {
        await axios.put(
          `https://localhost:7250/api/Tblsportcategories/${editingCategory.categoryId}`,
          values,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        message.success("Category updated successfully");
      } else {
        await axios.post("https://localhost:7250/api/Tblsportcategories", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Category added successfully");
      }
      setIsModalVisible(false);
      fetchCategories();
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  return (
    <div className="Admin_pagecontent">
      <Space size={20} direction="vertical">
        <Typography.Title level={4}>Sport Categories</Typography.Title>

        <Form className="d-flex justify-content-end">
          <Button variant="dark" className="mx-1" onClick={handleAdd}>
            Add Sport Category
          </Button>
        </Form>

        <Table
          loading={loading}
          dataSource={categories}
          rowKey="categoryId"
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content" }}
          columns={[
            {
              title: "Category ID",
              dataIndex: "categoryId",
              key: "categoryId",
              width: 100,
              fixed: "left",
            },
            {
              title: "Category Name",
              dataIndex: "categoryname",
              key: "categoryname",
              width: 200,
              fixed: "left",
            },
            {
              title: "Operation",
              key: "operation",
              width: 120,
              render: (text, record) => (
                <>
                  <Button
                    className="btn btn-primary btn-sm me-2 rounded-5"
                    onClick={() => handleEdit(record)}
                  >
                    <EditOutlined />
                  </Button>
                  <Popconfirm
                    title="Are you sure to delete?"
                    onConfirm={() => handleDelete(record.categoryId)}
                  >
                    <Button className="btn btn-danger btn-sm rounded-5">
                      <DeleteOutlined />
                    </Button>
                  </Popconfirm>
                </>
              ),
            },
          ]}
        />

        <Modal
          title={editingCategory ? "Edit Sport Category" : "Add Sport Category"}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={handleSubmit}
          okText={editingCategory ? "Update" : "Add"}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Category Name"
              name="categoryName"
              rules={[{ required: true, message: "Please enter a category name" }]}
            >
              <Input placeholder="Enter sport category name" />
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </div>
  );
};

export default Admin_sportcategories;
