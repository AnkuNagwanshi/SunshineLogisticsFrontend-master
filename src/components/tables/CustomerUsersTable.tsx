import { CommonTable, type ColumnDef } from "../commons/Table";
import { Button } from "../ui/button";
import { Info } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import axiosInstance from "@/services/axiosInstance";
import { AddCustomerForm } from "../dashboard/AddCustomer";

interface CustomerUsersData {
  id: number;
  name: string;
  email: string;
  mobile: string;
  companyName: string;
  gstNumber: string;
  address: string;
  pincode: string;
  pickupAddress: string[];
  role: string;
}

interface CustomerUsersTableProps {
 data: CustomerUsersData[];
  refreshCustomers: () => void;
}

const CustomerUsersTable = ({ data ,refreshCustomers}: CustomerUsersTableProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerUsersData | null>(null);
  const [selectedPickupAddress, setSelectedPickupAddress] = useState<string>("");

  const handleOpenDialog = (customer: CustomerUsersData) => {
    setSelectedCustomer(customer);
    setSelectedPickupAddress(customer.pickupAddress?.[0] || "");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedCustomer(null);
    setSelectedPickupAddress("");
  };

  const handleOpenEditDialog = (customer: CustomerUsersData) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedCustomer(null);
  };

const handleDeleteCustomer = async (id: number, name: string) => {
  try {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${name}?`);
    if (!confirmDelete) return;

    const res = await axiosInstance.delete(`/api/add_customer/${id}`);

    if (res.status === 200) {
      toast.success("Customer deleted successfully!");
      refreshCustomers();
      // Optional: refresh or remove deleted customer from table
      // setData((prev) => prev.filter((item) => item.id !== id));
    }
  } catch (error: any) {
    console.error("Error deleting customer:", error);
    toast.error(error.response?.data?.error || "Failed to delete customer.");
  }
};

  const columns: ColumnDef<CustomerUsersData>[] = [
    {
      key: "name",
      label: "Name",
      render: (row: CustomerUsersData) => (
        <div className="font-medium text-gray-900">{row.name}</div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (row: CustomerUsersData) => (
        <div className="text-sm text-gray-700">{row.email}</div>
      ),
    },
    {
      key: "mobile",
      label: "Mobile",
      render: (row: CustomerUsersData) => (
        <div className="text-sm text-gray-700">{row.mobile}</div>
      ),
    },
    {
      key: "companyName",
      label: "Company",
      render: (row: CustomerUsersData) => (
        <div className="text-sm text-gray-700">{row.companyName}</div>
      ),
    },
    {
      key: "gstNumber",
      label: "GST No.",
      render: (row: CustomerUsersData) => (
        <div className="text-sm text-gray-700">
          {row.gstNumber || "Not Provided"}
        </div>
      ),
    },
   {
  key: "address",
  label: "Address",
  render: (row: CustomerUsersData) => (
    <div
      className="text-sm text-gray-700 max-w-[250px] overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-900 rounded"
      //style={{ scrollbarWidth: "thin" }}
    >
      {row.address}
    </div>
  ),
},
    {
      key: "pincode",
      label: "Pincode",
      render: (row: CustomerUsersData) => (
        <div className="text-sm text-gray-700">{row.pincode}</div>
      ),
    },
    {
      key: "pickupAddress",
      label: "Pickup Address",
      render: (row: CustomerUsersData) => (
        row.pickupAddress && row.pickupAddress.length > 0 ? (
          <div className="w-[200px]">
            <Select defaultValue={row.pickupAddress[0]}>
              <SelectTrigger className="h-8 text-xs bg-white border-gray-300 w-full">
                <SelectValue placeholder="Select address" />
              </SelectTrigger>
              <SelectContent>
                {row.pickupAddress.map((addr, i) => (
                  <SelectItem key={i} value={addr} className="text-xs">
                    {addr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <span className="text-gray-500 text-sm">No pickup address</span>
        )
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (row: CustomerUsersData) => (
        <div className="text-sm text-gray-700 capitalize">{row.role}</div>
      ),
    },
    {
      key: "info",
      label: "Info",
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
  ];

  return (
    <div className="h-full">
      <CommonTable
        data={data}
        columns={columns}
        searchPlaceholder="Search customers by name or email..."
      />

      {/* Info Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Full details of the selected customer
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-6">
              {/* Name */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedCustomer.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedCustomer.companyName}
                </p>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-500">Email</span>
                  <span>{selectedCustomer.email}</span>
                </div>

                <div className="flex flex-col">
                  <span className="font-medium text-gray-500">Mobile</span>
                  <span>{selectedCustomer.mobile}</span>
                </div>

                <div className="flex flex-col">
                  <span className="font-medium text-gray-500">GST No.</span>
                  <span>{selectedCustomer.gstNumber || "Not Provided"}</span>
                </div>

                <div className="flex flex-col">
                  <span className="font-medium text-gray-500">Pincode</span>
                  <span>{selectedCustomer.pincode}</span>
                </div>

                <div className="col-span-2 flex flex-col">
                  <span className="font-medium text-gray-500">Address</span>
                  <span>{selectedCustomer.address}</span>
                </div>

                <div className="col-span-2 flex flex-col">
                  <span className="font-medium text-gray-500 mb-2">Pickup Locations</span>
                  {selectedCustomer.pickupAddress?.length > 0 ? (
                    <Select 
                      value={selectedPickupAddress} 
                      onValueChange={setSelectedPickupAddress}
                    >
                      <SelectTrigger className="bg-gray-50 text-sm">
                        <SelectValue placeholder="Select pickup location" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {selectedCustomer.pickupAddress.map((loc, index) => (
                          <SelectItem key={index} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-gray-600">No pickup locations added</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="font-medium text-gray-500">Role</span>
                  <span className="capitalize">{selectedCustomer.role}</span>
                </div>
              </div>
            </div>
          )}


        
          <Button
            variant="destructive"
            onClick={() => {
              if (selectedCustomer) {
                handleDeleteCustomer(selectedCustomer.id, selectedCustomer.name);
                handleCloseDialog();
              }
            }}
          >
            Delete
          </Button>

          <Button
            variant="default"
            onClick={() => {
              if (selectedCustomer) {
                handleCloseDialog();
                handleOpenEditDialog(selectedCustomer);
              }
            }}
          >
            Edit
          </Button>
          <DialogClose asChild>
            <Button variant="secondary" onClick={handleCloseDialog}>
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Customer Details</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Update the customer information below
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <AddCustomerForm
              customerId={selectedCustomer.id}
              initialData={{
                name: selectedCustomer.name,
                email: selectedCustomer.email,
                mobile: selectedCustomer.mobile,
                companyName: selectedCustomer.companyName,
                gstNumber: selectedCustomer.gstNumber,
                address: selectedCustomer.address,
                pincode: selectedCustomer.pincode,
                pickupAddress: selectedCustomer.pickupAddress,
              }}
              isEditMode={true}
              onSuccess={() => {
                handleCloseEditDialog();
                refreshCustomers();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerUsersTable;