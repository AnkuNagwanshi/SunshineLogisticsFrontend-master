import { CommonTable, type ColumnDef } from '../commons/Table';
import { Button } from '../ui/button';
import { Info, } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../ui/dialog';

interface CustomerUsersData {
  id: number;
  avatar?: File | null | string;
  firstName: string;
  lastName: string;
  email: string;
  // password?: string;
  mobile: number;
  companyName: string;
  country: string;
  state: string;
  city: string;
  address: string;
  role: string;
  info?: string;
}

interface CustomerUsersTableProps {
  data: CustomerUsersData[];
  // onEdit?: (customer: CustomerUsersData) => void;
  // onDelete?: (id: number) => void;
}


const  CustomerUsersTable = ({ data,
  //  onEdit, onDelete  
}: CustomerUsersTableProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUsersData | null>(null);

  const handleOpenDialog = (customer: CustomerUsersData) => {
    setSelectedCustomer(customer);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedCustomer(null);
  };

  // Define table columns
  const columns: ColumnDef<CustomerUsersData>[] = [
    {
      key: 'avatar',
      label: 'Profile Image',
      render: (row: CustomerUsersData) => {
        let imageUrl: string | null = null

        if (typeof row.avatar === 'string') {
          imageUrl = row.avatar
        } else if (row.avatar instanceof File) {
          imageUrl = URL.createObjectURL(row.avatar)
        }

        return imageUrl ? (
          <img
            src={imageUrl}
            alt="Agent Avatar"
            className="w-12 h-12 object-cover rounded-full border"
            onLoad={() => {
              if (row.avatar instanceof File) {
                URL.revokeObjectURL(imageUrl!)
              }
            }}
          />
        ) : (
          <span className="text-muted-foreground text-xs">No image</span>
        )
      }
    },
    {
      key: 'firstName',
      label: 'First Name',
      render: (row: CustomerUsersData) => (
        <div className="font-medium text-gray-900">{row.firstName}</div>
      ),
    },
    {
      key: 'lastName',
      label: 'Last Name',
      render: (row: CustomerUsersData) => (
        <div className="font-medium text-gray-900">{row.lastName}</div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (row: CustomerUsersData) => (
        <div className="text-sm text-gray-700">{row.email}</div>
      ),
    },
    // {
    //   key: 'password',
    //   label: 'Password',
    //   render: (row: CustomerUsersData) => (
    //     <div className="text-sm text-gray-700">{row.password}</div>
    //   ),
    // },

    {
      key: 'mobile',
      label: 'Mobile',
      render: (row: CustomerUsersData) => (
        <div className="text-sm text-gray-700">{row.mobile}</div>
      ),
    },
    {
      key: 'companyName',
      label: 'Company Name',
      render: (row: CustomerUsersData) => (
        <div className="text-sm text-gray-700">{row.companyName}</div>
      ),
    },
    {
      key: 'country',
      label: 'Country',
      render: (row: CustomerUsersData) => (
        <div className="text-sm text-gray-700">{row.country}</div>
      ),
    },
    {
      key: 'state',
      label: 'State',
      render: (row: CustomerUsersData) => (
        <div className="text-sm text-gray-700">{row.state}</div>
      ),
    },
    {
      key: 'city',
      label: 'City',
      render: (row: CustomerUsersData) => (
        <div className="text-sm text-gray-700">{row.city}</div>
      ),
    },
    {
      key: 'address',
      label: 'Address',
      render: (row: CustomerUsersData) => (
        <div className="text-sm text-gray-700">{row.address}</div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (row: CustomerUsersData) => (
        <div className="text-sm text-gray-700">{row.role}</div>
      ),
    },
    {
      key: 'info',
      label: 'Info',
      render: (row: CustomerUsersData) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => handleOpenDialog(row)}
        >
          <Info className="h-5 w-5 text-blue-500" />
        </Button>
      ),
    },
    // {
    //   key: 'actions',
    //   label: 'Actions',
    //   render: (row: CustomerUsersData) => (
    //     <div className="flex gap-2">
    //       {onEdit && (
    //         <Button
    //           variant="ghost"
    //           size="sm"
    //           onClick={() => onEdit(row)}
    //           className="text-gray-700"
    //         >
    //           <PencilLine className="h-5 w-5" />
    //         </Button>
    //       )}
    //       {onDelete && (
    //         <Button
    //           variant="ghost"
    //           size="sm"
    //           onClick={() => onDelete(row.id)}
    //           className="text-red-600 hover:text-red-800"
    //         >
    //           <Trash2 className="h-5 w-5" />
    //         </Button>
    //       )}
    //     </div>
    //   ),
    // },
  ];


  return (
    <div className="h-full">
      <CommonTable
        data={data}
        columns={columns}
        searchPlaceholder="Search agents by name or email..."
      />

      {/* Info Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Customer User Details</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Full details of the selected customer user
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Avatar centered */}
              <div className="flex justify-center">
                <img
                  src={
                    typeof selectedCustomer.avatar === 'string'
                      ? selectedCustomer.avatar
                      : selectedCustomer.avatar
                      ? URL.createObjectURL(selectedCustomer.avatar)
                      : '/default-avatar.png'
                  }
                  alt={`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}
                  className="w-24 h-24 rounded-full object-cover shadow-md"
                />
              </div>

              {/* 2-column grid layout */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-500">Name</span>
                  <span>{selectedCustomer.firstName} {selectedCustomer.lastName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-500">Email</span>
                  <span>{selectedCustomer.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-500">Mobile</span>
                  <span>{selectedCustomer.mobile}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-500">Company</span>
                  <span>{selectedCustomer.companyName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-500">Country</span>
                  <span>{selectedCustomer.country}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-500">State</span>
                  <span>{selectedCustomer.state}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-500">City</span>
                  <span>{selectedCustomer.city}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-500">Address</span>
                  <span>{selectedCustomer.address}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-500">Role</span>
                  <span>{selectedCustomer.role}</span>
                </div>
               
              </div>
            </div>
          
          )}
          <DialogClose asChild>
            <Button variant="secondary" onClick={handleCloseDialog}>
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CustomerUsersTable