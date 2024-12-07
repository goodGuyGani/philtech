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
import { format } from "date-fns";

const AtmReportCreation = () => {
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
        header: false,
        skipEmptyLines: true,
        complete: (results: any) => {
          const rawData = results.data;
          const validTransactions = [];
          const currentYear = new Date().getFullYear();
          let merchant_id = "";
          let merchant_name = "";
          let collectingMerchantName = false;

          // Iterate through the CSV data
          for (let i = 0; i < rawData.length; i++) {
            const row = rawData[i];

            // Extract Merchant ID
            if (
              row[0] &&
              row[0].startsWith("Merchant ID") &&
              row[0].includes(":")
            ) {
              const merchantIdMatch = row[0].match(/Merchant ID:(\d+)/);
              if (merchantIdMatch) {
                merchant_id = merchantIdMatch[1].trim(); // Extract only the ID number
                merchant_name = ""; // Reset the merchant name
                collectingMerchantName = true; // Start collecting the merchant name
              }
            }

            // Collect Merchant Name if on the next lines
            if (
              collectingMerchantName &&
              row[0] &&
              row[0].startsWith("Merchant Name:")
            ) {
              merchant_name = row[0].replace("Merchant Name:", "").trim();
              collectingMerchantName = false; // Stop collecting once we have the name
            } else if (collectingMerchantName && row[0]) {
              // Append additional lines if the merchant name spans multiple rows
              merchant_name += " " + row[0].trim();
            }

            // Clean up the merchant name to only keep the actual name
            if (merchant_name.includes(":")) {
              merchant_name = merchant_name.split(":").pop()?.trim() || "";
            }

            // Process transaction rows after collecting merchant data
            if (row[1] && row[1].match(/\d{1,2}-\w{3}/)) {
              // Checks if the date format matches DD-MMM
              const dateStr = `${row[1]}-${currentYear}`; // Form the complete date
              const parsedDate = new Date(dateStr); // Parse the date string

              // Format date to 'YYYY-MM-DD HH:mm:ss'
              const formattedDate = format(parsedDate, "yyyy-MM-dd HH:mm:ss");

              const withdrawCount = parseInt(row[2], 10);

              // Ensure `withdrawCount` is not NaN
              const validWithdrawCount = isNaN(withdrawCount)
                ? 0
                : withdrawCount;

              validTransactions.push({
                merchant_id,
                merchant_name,
                transaction_date: formattedDate, // Send formatted date to backend
                withdraw_count: validWithdrawCount,
                balance_inquiry_count: parseInt(row[3], 10) || 0,
                fund_transfer_count: parseInt(row[4], 10) || 0,
                total_transaction_count: parseInt(row[5], 10) || 0,
                withdraw_amount: parseFloat(row[6]) || 0,
                balance_inquiry_amount: parseFloat(row[7]) || 0,
                fund_transfer_amount: parseFloat(row[8]) || 0,
                total_amount: parseFloat(row[9]) || 0,
                transaction_fee_rcbc: parseFloat(row[10]) || 0,
                transaction_fee_merchant: parseFloat(row[11]) || 0,
                status: "unchecked",
              });
            }
          }

          setEmployees(validTransactions);
          console.log(validTransactions);

          if (validTransactions.length > 0) {
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

  const sanitizeValue = (value: number) => {
    return isNaN(value) || value === null ? 0 : value;
  };

  const handleDelete = (index: number) => {
    const updatedEmployees = [...employees];
    updatedEmployees.splice(index, 1);
    setEmployees(updatedEmployees);
  };

  const handleCreateAccounts = () => {
    setLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_BASE_URL}/upload-atm-transaction`,
        employees
      )
      .then(() => {
        setLoading(false);
        toast({
          title: "ATM Transactions Created",
          description: `Successfully created rows for ${employees.length} ATM Transactions.`,
        });
        setSubmitted(true);
        setTimeout(() => {
          navigate(0);
        }, 2000);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error creating transactions:", error);
        toast({
          title: "Error",
          description: "Failed to create transaction accounts",
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
            className={`mx-auto py-12 main-content h-w-full mt-5 sm:px-6 lg:px-8 ${
              employees.length > 0 ? "grid" : "flex-col"
            } md:grid-cols-2 gap-8`}
          >
            <div className="space-y-4">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold">ATM Report Uploading</h1>
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
                <h2 className="text-2xl font-bold">Transaction Section</h2>
                {employees.map((employee, index) => (
                  <Card key={index} className="border">
                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-primary">
                            Merchant ID
                          </h3>
                          <p className="text-sm">{employee.merchant_Id}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-primary">
                            Merchant Name
                          </h3>
                          <p className="text-sm">{employee.merchant_name}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-primary">
                            Transaction Date
                          </h3>
                          <p className="text-sm">{employee.transaction_date}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-primary">
                            Withdraw Count
                          </h3>
                          <p className="text-sm">{employee.withdraw_count}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-primary">
                            Balance Inquiry Count
                          </h3>
                          <p className="text-sm">
                            {employee.balance_inquiry_count}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-primary">
                            Fund Transfer Count
                          </h3>
                          <p className="text-sm">
                            {employee.fund_transfer_count}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-primary">
                            Withdraw Amount
                          </h3>
                          <p className="text-sm">₱{employee.withdraw_amount}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-primary">
                            Total Amount
                          </h3>
                          <p className="text-sm">₱{employee.total_amount}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-primary">
                            Transaction Fee (RCBC)
                          </h3>
                          <p className="text-sm">
                            ₱{sanitizeValue(employee.transaction_fee_rcbc)}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-primary">
                            Transaction Fee (Merchant)
                          </h3>
                          <p className="text-sm">
                            ₱{sanitizeValue(employee.transaction_fee_merchant)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
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

export default AtmReportCreation;
