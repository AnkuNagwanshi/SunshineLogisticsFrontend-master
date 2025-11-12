import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/services/axiosInstance';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SubAdmin {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string | null;
  city: string | null;
  createdAt: string;
}

const SubAdminManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Redirect if not main admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Access denied: Only main admin can manage sub-admins');
      navigate('/orders'); // Redirect to orders page
    }
  }, [user, navigate]);

  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobile: '',
    city: '',
  });

  // Fetch all sub-admins
  const fetchSubAdmins = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/sub-admins');
      setSubAdmins(response.data.subAdmins);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch sub-admins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.email) {
      toast.error('First name and email are required');
      return;
    }

    if (!editMode && !formData.password) {
      toast.error('Password is required for new sub-admin');
      return;
    }

    try {
      setLoading(true);
      
      if (editMode && selectedId) {
        // Update sub-admin
        const payload: any = { ...formData };
        if (!payload.password) delete payload.password; // Don't send empty password
        
        await axiosInstance.put(`/api/sub-admins/${selectedId}`, payload);
        toast.success('Sub-Admin updated successfully');
      } else {
        // Create new sub-admin
        await axiosInstance.post('/api/sub-admins', formData);
        toast.success('Sub-Admin created successfully');
      }

      fetchSubAdmins();
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (subAdmin: SubAdmin) => {
    setEditMode(true);
    setSelectedId(subAdmin.id);
    setFormData({
      firstName: subAdmin.firstName,
      lastName: subAdmin.lastName || '',
      email: subAdmin.email,
      password: '',
      mobile: subAdmin.mobile || '',
      city: subAdmin.city || '',
    });
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this Sub-Admin?')) return;

    try {
      setLoading(true);
      await axiosInstance.delete(`/api/sub-admins/${id}`);
      toast.success('Sub-Admin deleted successfully');
      fetchSubAdmins();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      mobile: '',
      city: '',
    });
    setShowForm(false);
    setEditMode(false);
    setSelectedId(null);
    setShowPassword(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sub-Admin Management</h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Sub-Admin'}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editMode ? 'Edit Sub-Admin' : 'Create New Sub-Admin'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Enter first name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Enter last name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Password {!editMode && <span className="text-red-500">*</span>}
                {editMode && <span className="text-gray-500 text-xs">(Leave empty to keep current)</span>}
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  required={!editMode}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mobile</label>
              <Input
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="Enter mobile number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Enter city"
              />
            </div>

            <div className="col-span-2 flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                {loading ? 'Saving...' : editMode ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Sub-Admins List */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">Loading...</td>
                </tr>
              ) : subAdmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No sub-admins found. Click "Add Sub-Admin" to create one.
                  </td>
                </tr>
              ) : (
                subAdmins.map((subAdmin) => (
                  <tr key={subAdmin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subAdmin.firstName} {subAdmin.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{subAdmin.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{subAdmin.mobile || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{subAdmin.city || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(subAdmin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(subAdmin)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(subAdmin.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubAdminManagement;
