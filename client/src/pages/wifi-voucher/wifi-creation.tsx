import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  IconCircleCheck,
  IconUpload,
  IconFileTypeCsv,
  IconLoader2,
  IconEdit,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";

const WifiVoucherCreation = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFileName(file.name);
      Papa.parse(file, {
        header: true,
        complete: (results: any) => {
          const jsonData = results.data;
  
          // Function to convert MM/DD/YYYY HH:mm to YYYY-MM-DD HH:mm
          const convertToISO8601 = (dateString: string) => {
            const [datePart, timePart] = dateString.split(' ');
            const [month, day, year] = datePart.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${timePart}`;
          };
  
          // Validate and map the data to the expected format
          const validVouchers = jsonData
            .filter(
              (voucher: any) =>
                voucher.code &&
                voucher.amount &&
                voucher.surfing &&
                voucher.validityDays
            )
            .map((voucher: any) => {
              return {
                code: voucher.code, // Use 'code' from CSV
                amount: parseInt(voucher.amount, 10), // Ensure amount is an integer
                surfing: parseInt(voucher.surfing, 10), // Ensure surfing is an integer
                validity_days: parseInt(voucher.validityDays, 10), // Ensure validityDays is an integer
                duration: voucher.duration || "1 hour", // Default value if missing
                validity_text: voucher.validityText || "Valid for 1 hour", // Default value if missing
                note: voucher.note || "No notes", // Default value if missing
                voucher_created_at: voucher.createdAt ? convertToISO8601(voucher.createdAt) : new Date().toISOString(), // Convert date or set to current date if missing
              };
            });
  
          setEmployees(validVouchers);
          console.log(validVouchers);
  
          // Show appropriate toast notification
          if (validVouchers.length > 0) {
            toast({
              title: "Success",
              description: "CSV uploaded successfully",
            });
          } else {
            toast({
              title: "Failed",
              description: "CSV table is in the wrong format",
              variant: "destructive",
            });
          }
        },
        error: (error: any) => {
          console.error("Error parsing CSV:", error);
          toast({
            title: "Error",
            description: "Failed to parse CSV file",
            variant: "destructive",
          });
        },
      });
    }
  }, []);

  const handleDelete = (index: number) => {
    const updatedEmployees = [...employees];
    updatedEmployees.splice(index, 1);
    setEmployees(updatedEmployees);
  };

  const handleCreateAccounts = () => {
    setLoading(true);
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/api/upload-wifi-vouchers`, employees)
      .then(() => {
        setLoading(false);
        toast({
          title: "WiFI Voucher Created",
          description: `Successfully created Vouchers for ${employees.length} WiFi.`,
        });
        setSubmitted(true);
        setTimeout(() => {
          navigate(0);
        }, 2000);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error creating accounts:", error);
        toast({
          title: "Error",
          description: "Failed to create employee accounts",
          variant: "destructive",
        });
      });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
  });

  return (
    <>
      {submitted ? (
        <div className="flex flex-col items-center justify-center h-96">
          <IconCircleCheck className="w-20 h-20 text-green-800 mb-5" />
          <h1 className="text-3xl font-bold text-primary">Accounts Created!</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            All accounts have been successfully created.
          </p>
        </div>
      ) : (
        <div
          className={`relative ${
            loading ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <div
            className={`mx-auto py-12 main-content h-full w-full mt-5 sm:px-6 lg:px-8 ${
              employees.length > 0 ? "grid" : "flex-col"
            } md:grid-cols-2 gap-8`}
          >
            <div className="space-y-4">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold">WiFi Pin Uploading</h1>
                <p className="text-muted-foreground">
                  Upload a CSV file containing your voucher information to
                  create accounts for all retailers.
                </p>
                <div className="flex flex-row items-center justify-center w-full max-w-5xl gap-4 mx-auto">
                  <div className="flex flex-col items-center mt-6 ml-2">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full text-muted font-bold">
                      1
                    </div>
                  </div>
                  <div
                    className={`flex-1 mt-4 w-full h-0.5 ${
                      employees.length > 0 ? "bg-primary" : "bg-muted"
                    }`}
                  />
                  <div className="flex flex-col items-center mt-6">
                    <div
                      className={`flex items-center justify-center w-10 h-10 ${
                        employees.length > 0
                          ? "bg-primary text-muted"
                          : "bg-muted text-muted-foreground"
                      } rounded-full font-bold`}
                    >
                      2
                    </div>
                  </div>
                  <div
                    className={`flex-1 mt-4 w-full h-0.5 ${
                      loading ? "bg-primary" : "bg-muted"
                    }`}
                  />
                  <div className="flex flex-col items-center mt-6 mr-2">
                    <div
                      className={`flex items-center justify-center w-10 h-10 ${
                        loading
                          ? "bg-primary text-muted"
                          : "bg-muted text-muted-foreground"
                      } rounded-full font-bold`}
                    >
                      3
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between w-full max-w-5xl gap-4 mx-auto">
                  <p className="mt-2 text-lg font-medium">Upload</p>
                  <p className="mt-2 text-lg font-medium">
                    Checking & Verification
                  </p>
                  <p className="mt-2 text-lg font-medium">Submit</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="csv-file">CSV File</Label>
                  <div
                    {...getRootProps()}
                    className="flex items-center justify-center w-full"
                  >
                    <input
                      {...getInputProps()}
                      id="csv-file"
                      className="hidden"
                    />
                    <label
                      className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-900 rounded-lg cursor-pointer ${
                        isDragActive ? "bg-gray-200" : "dark:hover:bg-gray-800"
                      }`}
                    >
                      {employees.length > 0 ? (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <IconFileTypeCsv className="w-10 h-10 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">{fileName}</span>
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <IconUpload className="w-10 h-10 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            CSV file up to 10MB
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
              {employees.length > 0 && (
                <div className="rounded-lg border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-lg font-medium">Edit and Verify</p>
                      <p className="text-muted-foreground">
                        {employees.length} record(s) uploaded.
                      </p>
                    </div>
                    <IconEdit className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
              )}
            </div>
            {employees.length > 0 && (
              <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-16rem)]">
                <h2 className="text-2xl font-bold">Voucher Section</h2>
                {employees.map((employee, index) => (
                  <Card className="w-full">
                    <CardContent className="p-6 space-y-6">
                      {/* Voucher Code and Amount */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-primary">
                            Voucher Code
                          </h3>
                          <p className="text-sm font-medium">{employee.code}</p>
                        </div>
                        <div className="text-right">
                          <h3 className="text-lg font-semibold text-primary">
                            Amount
                          </h3>
                          <p className="text-sm font-medium">
                            ₱{employee.amount}
                          </p>
                        </div>
                      </div>

                      {/* Surfing Time and Validity Period */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-primary">
                            Surfing Time
                          </h3>
                          <p className="text-sm font-medium">
                            {employee.surfing} MB
                          </p>
                        </div>
                        <div className="text-right">
                          <h3 className="text-lg font-semibold text-primary">
                            Validity Days
                          </h3>
                          <p className="text-sm font-medium">
                            {employee.validity_days} day(s)
                          </p>
                        </div>
                      </div>

                      {/* Duration and Validity Text */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-primary">
                            Duration
                          </h3>
                          <p className="text-sm font-medium">
                            {employee.duration}
                          </p>
                        </div>
                        <div className="text-right">
                          <h3 className="text-lg font-semibold text-primary">
                            Validity Info
                          </h3>
                          <p className="text-sm font-medium">
                            {employee.validity_text}
                          </p>
                        </div>
                      </div>

                      {/* Note Section */}
                      <div>
                        <h3 className="text-lg font-semibold text-primary">
                          Notes
                        </h3>
                        <p className="text-sm font-medium">{employee.note}</p>
                      </div>

                      {/* Creation Date */}
                      <div className="text-right">
                        <h3 className="text-lg font-semibold text-primary">
                          Created At
                        </h3>
                        <p className="text-sm font-medium">
                          {new Date(employee.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>

                    {/* Card Footer with Action Buttons */}
                    <CardFooter className="flex justify-end space-x-2 p-6 pt-0">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
            {employees.length > 0 && (
              <Button
                className="w-full col-span-full"
                variant="default"
                onClick={handleCreateAccounts}
              >
                {loading ? "Creating Accounts..." : "Create Accounts"}
              </Button>
            )}
          </div>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="text-white">
                <IconLoader2 className="animate-spin h-full w-full ml-2" />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default WifiVoucherCreation;
