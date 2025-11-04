import { CommonTable, type ColumnDef } from '../commons/Table';
import { Button } from '../ui/button';
import { PencilLine, Trash2, Info, } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../ui/dialog';

import { AgentData } from '../commons/types';

// interface AgentData {
//   id: number;
//   avatar?: File | null | string;
//   firstName: string;
//   lastName: string;
//   // compnayName:string;
//   mobile: string;
//   email: string;
//   country: string;
//   state: string;
//   city: string;
//   cityPincode: string;
//   password?: string;
//   role: string;
//   info?: string;
// }

interface AgentTableProps {
  data: AgentData[];
  onEdit?: (agent: AgentData) => void;
  onDelete?: (id: number) => void;
}

export function DeliveryAgentTable({ data, onEdit, onDelete }: AgentTableProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentData | null>(null);

  const handleOpenDialog = (agent: AgentData) => {
    setSelectedAgent(agent);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedAgent(null);
  };

   const resolveAvatar = (avatar: string | File | null | undefined): string | null => {
    if (!avatar) return null;
    if (typeof avatar === "string") return avatar;
    if (typeof File !== "undefined" && avatar instanceof File) {
      return URL.createObjectURL(avatar);
    }
    return null;
  };

  // Define table columns
  const columns: ColumnDef<AgentData>[] = [
  {
  key: "avatar",
  label: "Profile Image",
  render: (row) => {
    const imageUrl = resolveAvatar(row.avatar);

    // ✅ Type guard ensures TypeScript knows we're checking a File
    const isFile = (value: unknown): value is File =>
      typeof File !== "undefined" && value instanceof File;

    return imageUrl ? (
      <img
        src={imageUrl}
        alt="Agent Avatar"
        className="w-12 h-12 object-cover rounded-full border"
        onLoad={() => {
          if (isFile(row.avatar)) {
            URL.revokeObjectURL(imageUrl);
          }
        }}
      />
    ) : (
      <span className="text-muted-foreground text-xs">No image</span>
    );
  },
},
    {
      key: 'firstName',
      label: 'First Name',
      render: (row: AgentData) => (
        <div className="font-medium text-gray-900">{row.firstName}</div>
      ),
    },
    {
      key: 'lastName',
      label: 'Last Name',
      render: (row: AgentData) => (
        <div className="font-medium text-gray-900">{row.lastName}</div>
      ),
    },
    // {
    //   key: 'companyName',
    //   label: 'Company Name',
    //   render: (row: AgentData) => (
    //     <div className="font-medium text-gray-900">{row.companyName}</div>
    //   ),
    // },
    {
      key: 'mobile',
      label: 'Mobile',
      render: (row: AgentData) => (
        <div className="text-sm text-gray-700">{row.mobile}</div>
      ),
    },

    {
      key: 'email',
      label: 'Email',
      render: (row: AgentData) => (
        <div className="text-sm text-gray-700">{row.email}</div>
      ),
    },

    //  {
    //   key: 'address',
    //   label: 'Address',
    //   render: (row: AgentData) => (
    //     <div className="text-sm text-gray-700">{row.address}</div>
    //   ),
    // },

    {
      key: 'country',
      label: 'Country',
      render: (row: AgentData) => (
        <div className="text-sm text-gray-700">{row.country}</div>
      ),
    },

    {
      key: 'state',
      label: 'State',
      render: (row: AgentData) => (
        <div className="text-sm text-gray-700">{row.state}</div>
      ),
    },

    {
      key: 'city',
      label: 'City',
      render: (row: AgentData) => (
        <div className="text-sm text-gray-700">{row.city}</div>
      ),
    },

     {
      key: 'cityPincode',
      label: 'City Pincode',
      render: (row: AgentData) => (
        <div className="text-sm text-gray-700">{row.cityPincode}</div>
      ),
    },
    // {
    //   key: 'password',
    //   label: 'Password',
    //   render: (row: AgentData) => (
    //     <div className="text-sm text-gray-700">{row.password}</div>
    //   ),
    // },
    {
      key: 'info',
      label: 'Info',
      render: (row: AgentData) => (
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
    {
      key: 'actions',
      label: 'Actions',
      render: (row: AgentData) => (
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(row)}
              className="text-gray-700"
            >
              <PencilLine className="h-5 w-5" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(row.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full">
      <CommonTable
        data={data}
        columns={columns}
        searchPlaceholder="Search agents by name or email..."
      />

      {/* Info Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agent Details</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Full details of the delivery agent
            </DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-6">
              {/* Avatar centered */}
              <div className="flex justify-center">
                <img
                  src={resolveAvatar(selectedAgent.avatar) || "/default-avatar.png"}
                  alt={`${selectedAgent.firstName} ${selectedAgent.lastName}`}
                  className="w-24 h-24 rounded-full object-cover shadow-md"
                />
              </div>

              {/* 2-column grid layout */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-500">Name</span>
                  <span>{selectedAgent.firstName + " " + selectedAgent.lastName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-500">Email</span>
                  <span>{selectedAgent.email}</span>
                </div>

                <div className="flex flex-col">
                  <span className="font-medium text-gray-500">Role</span>
                  <span>{selectedAgent.role}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-500">Password</span>
                  <span className='truncate max-w-[120px]'>{selectedAgent.password}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-500">Country</span>
                  <span className='truncate max-w-[120px]'>{selectedAgent.country}</span>
                </div>

                <div className="flex flex-col">
                  <span className="font-medium text-gray-500">State</span>
                  <span className='truncate max-w-[120px]'>{selectedAgent.state}</span>
                </div>

                <div className="flex flex-col">
                  <span className="font-medium text-gray-500">City</span>
                  <span className='truncate max-w-[120px]'>{selectedAgent.city}</span>
                </div>

                <div className="flex flex-col">
                  <span className="font-medium text-gray-500">City Pincode</span>
                  <span className='truncate max-w-[120px]'>{selectedAgent.cityPincode}</span>
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
  );
}
