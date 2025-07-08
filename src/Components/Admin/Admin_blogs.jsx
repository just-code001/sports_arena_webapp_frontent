import { useState, useEffect } from "react"
import { Table, Space, Typography, Popconfirm, Modal, Form, Input, message } from "antd"
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import Button from "react-bootstrap/Button"
import axios from "axios"

const { TextArea } = Input

const Admin_blogs = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const token = sessionStorage.getItem("token")
      if (!token) {
        message.error("Please login to continue")
        return
      }

      const response = await axios.get("https://localhost:7250/api/Tblblogs", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setBlogs(response.data.data)
      } else {
        message.error("Failed to fetch blogs")
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
      if (error.response?.status === 401) {
        message.error("Session expired. Please login again.")
      } else {
        message.error("Failed to fetch blogs")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingBlog(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (blog) => {
    setEditingBlog(blog)
    form.setFieldsValue({
      title: blog.title,
      content: blog.content,
    })
    setIsModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("token")
      const response = await axios.delete(`https://localhost:7250/api/Tblblogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        message.success("Blog deleted successfully")
        fetchBlogs()
      } else {
        message.error(response.data.message || "Failed to delete blog")
      }
    } catch (error) {
      console.error("Error deleting blog:", error)
      message.error(error.response?.data?.message || "Failed to delete blog")
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const token = sessionStorage.getItem("token")

      if (!token) {
        message.error("Please login to continue")
        return
      }

      let response
      if (editingBlog) {
        // Update existing blog
        response = await axios.put(`https://localhost:7250/api/Tblblogs/${editingBlog.blogId}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.data.success) {
          message.success("Blog updated successfully")
        } else {
          message.error(response.data.message || "Failed to update blog")
          return
        }
      } else {
        // Create new blog
        response = await axios.post("https://localhost:7250/api/Tblblogs", values, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.data.success) {
          message.success("Blog added successfully")
        } else {
          message.error(response.data.message || "Failed to add blog")
          return
        }
      }

      setIsModalVisible(false)
      form.resetFields()
      setEditingBlog(null)
      fetchBlogs()
    } catch (error) {
      console.error("Error submitting blog:", error)
      if (error.response?.data?.message) {
        message.error(error.response.data.message)
      } else if (error.response?.status === 401) {
        message.error("Session expired. Please login again.")
      } else {
        message.error("Something went wrong. Please try again.")
      }
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
    setEditingBlog(null)
  }

  const columns = [
    {
      title: "Blog ID",
      dataIndex: "blogId",
      key: "blogId",
      width: 100,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "Author",
      dataIndex: "authorName",
      key: "authorName",
      ellipsis: true,
    },
    {
      title: "Publish Date",
      dataIndex: "publishDate",
      key: "publishDate",
      width: 150,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, blog) => (
        <Space>
          <Button variant="warning" size="sm" onClick={() => handleEdit(blog)} title="Edit Blog">
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Delete Blog"
            description="Are you sure you want to delete this blog? This action cannot be undone."
            onConfirm={() => handleDelete(blog.blogId)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button variant="danger" size="sm" title="Delete Blog">
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Typography.Title level={3} className="mb-0">
          Manage Blogs
        </Typography.Title>
        <Button variant="primary" onClick={handleAdd}>
          <PlusOutlined /> Add New Blog
        </Button>
      </div>

      <Table
        dataSource={blogs}
        columns={columns}
        rowKey="blogId"
        loading={loading}
        bordered
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} blogs`,
        }}
        scroll={{ x: 800 }}
      />

      <Modal
        title={<div className="d-flex align-items-center">{editingBlog ? "Edit Blog" : "Add New Blog"}</div>}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={editingBlog ? "Update Blog" : "Create Blog"}
        cancelText="Cancel"
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            name="title"
            label="Blog Title"
            rules={[
              { required: true, message: "Please enter blog title" },
              { min: 3, message: "Title must be at least 3 characters" },
              { max: 200, message: "Title cannot exceed 200 characters" },
            ]}
          >
            <Input placeholder="Enter blog title" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Blog Content"
            rules={[
              { required: true, message: "Please enter blog content" },
              { min: 50, message: "Content must be at least 50 characters" },
            ]}
          >
            <TextArea rows={10} placeholder="Enter blog content" showCount />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Admin_blogs
