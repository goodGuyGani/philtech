import { useCallback, useEffect, useState } from "react";
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
  IconCurrencyPeso,
  IconPercentage,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const TelevisionCreation = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [voucherPrice, setVoucherPrice] = useState<number>(0);
  const [voucherPercentage, setVoucherPercentage] = useState<number>(0);
  const [generationPercentage, setGenerationPercentage] = useState({
    firstGen: 0,
    secondGen: 0,
    thirdGen: 0,
    fourthGen: 0,
    fifthGen: 0,
    sixthGen: 0,
    seventhGen: 0,
    eightGen: 0,
    ninthGen: 0,
    tenthGen: 0,
  });
  const [, setIfAmountEditing] = useState<boolean>(false);
  const [ifDialogOpen, setIfDialogOpen] = useState<any>();
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFileName(file.name);
      console.log(file);
      Papa.parse(file, {
        header: true,
        complete: (results: { data: Record<string, string>[] }) => {
          const jsonData = results.data;

          // Validate and map the data to the expected format
          const validRecords = jsonData
            .filter(
              (record: any) =>
                record.Product &&
                record["Card No."] &&
                record["Password / Recharge Code"] &&
                record.status
            )
            .map((record: any) => ({
              product_name: record.Product,
              card_number: record["Card No."],
              account: record.Account || "", // Keep this as an empty string if missing
              // Convert scientific notation to full number string
              voucher_code: record["Password / Recharge Code"].toString(),
              status: record.status,
              amount: voucherPrice,
              discount: voucherPercentage,
              //Generation income
              // firstGen: generationPercentage.firstGen,
              // secondGen: generationPercentage.secondGen,
              // thirdGen: generationPercentage.thirdGen,
              // fourthGen: generationPercentage.fourthGen,
              // fifthGen: generationPercentage.fifthGen,
              // sixthGen: generationPercentage.sixthGen,
              // seventhGen: generationPercentage.seventhGen,
              // eighthGen: generationPercentage.eightGen,
              // ninthGen: generationPercentage.ninthGen,
              // tenthGen: generationPercentage.tenthGen,
            }));

          setEmployees(validRecords);
          console.log(validRecords);

          if (validRecords.length > 0) {
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
        error: (error: Error) => {
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
      .post(`${import.meta.env.VITE_BASE_URL}/upload-tv-voucher`, employees)
      .then(() => {
        setLoading(false);
        toast({
          title: "Accounts Created",
          description: `Successfully created vouchers for ${employees.length} TV Voucher.`,
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
          description: "Failed to create voucher accounts",
          variant: "destructive",
        });
      });
  };

  const handleChangeAmount = () => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((record) => ({
        ...record,
        amount: voucherPrice,
        discount: voucherPercentage,
        // firstGen: generationPercentage.firstGen,
        // secondGen: generationPercentage.secondGen,
        // thirdGen: generationPercentage.thirdGen,
        // fourthGen: generationPercentage.fourthGen,
        // fifthGen: generationPercentage.fifthGen,
        // sixthGen: generationPercentage.sixthGen,
        // seventhGen: generationPercentage.seventhGen,
        // eighthGen: generationPercentage.eightGen,
        // ninthGen: generationPercentage.ninthGen,
        // tenthGen: generationPercentage.tenthGen,
      }))
    );
    setIfAmountEditing(false);
    setIfDialogOpen(false); // Close the dialog after saving changes
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
  });

  useEffect(() => {
    console.log(generationPercentage);
  }, [generationPercentage]);
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
                <h1 className="text-3xl font-bold">TV Pin Uploading</h1>
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
                <div className="flex flex-row items-center justify-between">
                  <h2 className="text-2xl font-bold">Voucher Section</h2>
                </div>
                <Separator />
                <div className="p-6 max-w-full mx-auto">
                  <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
                    Generation Percentages
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First Column */}
                    <div className="space-y-3">
                      <p className="flex justify-between items-center">
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          1st:
                        </span>
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                          {employees[0].firstGen}%
                        </span>
                      </p>
                      <p className="flex justify-between items-center">
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          2nd:
                        </span>
                        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                          {employees[0].secondGen}%
                        </span>
                      </p>
                      <p className="flex justify-between items-center">
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          3rd:
                        </span>
                        <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                          {employees[0].thirdGen}%
                        </span>
                      </p>
                      <p className="flex justify-between items-center">
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          4th:
                        </span>
                        <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                          {employees[0].fourthGen}%
                        </span>
                      </p>
                      <p className="flex justify-between items-center">
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          5th:
                        </span>
                        <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                          {employees[0].fifthGen}%
                        </span>
                      </p>
                    </div>

                    {/* Second Column */}
                    <div className="space-y-3">
                      <p className="flex justify-between items-center">
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          6th:
                        </span>
                        <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded">
                          {employees[0].sixthGen}%
                        </span>
                      </p>
                      <p className="flex justify-between items-center">
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          7th:
                        </span>
                        <span className="bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 px-2 py-1 rounded">
                          {employees[0].seventhGen}%
                        </span>
                      </p>
                      <p className="flex justify-between items-center">
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          8th:
                        </span>
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
                          {employees[0].eighthGen}%
                        </span>
                      </p>
                      <p className="flex justify-between items-center">
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          9th:
                        </span>
                        <span className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 px-2 py-1 rounded">
                          {employees[0].ninthGen}%
                        </span>
                      </p>
                      <p className="flex justify-between items-center">
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          10th:
                        </span>
                        <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                          {employees[0].tenthGen}%
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 mt-2 w-1/2 place-self-end">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Amount:
                      </span>
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        ₱ {employees[0].amount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Discount:
                      </span>
                      <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                        {employees[0].discount}%
                      </span>
                    </div>
                  </div>
                </div>
                <Dialog open={ifDialogOpen} onOpenChange={setIfDialogOpen}>
                  <DialogTrigger asChild>
                    {voucherPrice ? (
                      <Button className="w-full" variant="outline">
                        Edit Amount
                      </Button>
                    ) : (
                      <Button className="w-full" variant="outline">
                        Add Amount
                      </Button>
                    )}
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                      <DialogTitle>Edit Amount</DialogTitle>
                      <DialogDescription>
                        Make changes to your voucher here. Click save when
                        you're done.
                      </DialogDescription>
                      <Separator />
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {/* Amount Input Section */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                          Amount
                        </Label>
                        <div className="relative col-span-3">
                          {/* Peso Icon */}
                          <IconCurrencyPeso className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            id="amount"
                            className="pl-9"
                            value={voucherPrice}
                            onChange={(e) =>
                              setVoucherPrice(Number(e.target.value))
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                          Discount
                        </Label>
                        <div className="relative col-span-3">
                          {/* Peso Icon */}
                          <IconPercentage className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            id="amount"
                            className="pl-9"
                            value={voucherPercentage}
                            onChange={(e) =>
                              setVoucherPercentage(Number(e.target.value))
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <DialogHeader>
                      <DialogTitle>Generation Income</DialogTitle>
                      <DialogDescription>
                        Make changes to your voucher here. Click save when
                        you're done.
                      </DialogDescription>
                      <Separator />
                    </DialogHeader>

                    <div className="flex flex-row">
                      <div className="flex flex-col gap-4 py-4">
                        {/* Amount Input Section */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="firstGen" className="text-right">
                            1st Gen
                          </Label>
                          <div className="relative col-span-3">
                            {/* Percentage Icon */}
                            <IconPercentage className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                              id="firstGen"
                              className="pl-9"
                              type=""
                              value={generationPercentage.firstGen.toString()}
                              onChange={(e) =>
                                setGenerationPercentage((prev) => ({
                                  ...prev, // Spread the previous state
                                  firstGen: Number(e.target.value), // Update only the firstGen field
                                }))
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            2nd Gen
                          </Label>
                          <div className="relative col-span-3">
                            {/* Peso Icon */}
                            <IconPercentage className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                              id="amount"
                              className="pl-9"
                              value={generationPercentage.secondGen.toString()}
                              onChange={(e) =>
                                setGenerationPercentage((prev) => ({
                                  ...prev, // Spread the previous state
                                  secondGen: Number(e.target.value), // Update only the firstGen field
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            3rd Gen
                          </Label>
                          <div className="relative col-span-3">
                            {/* Peso Icon */}
                            <IconPercentage className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                              id="amount"
                              className="pl-9"
                              value={generationPercentage.thirdGen.toString()}
                              onChange={(e) =>
                                setGenerationPercentage((prev) => ({
                                  ...prev, // Spread the previous state
                                  thirdGen: Number(e.target.value), // Update only the firstGen field
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            4th Gen
                          </Label>
                          <div className="relative col-span-3">
                            {/* Peso Icon */}
                            <IconPercentage className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                              id="amount"
                              className="pl-9"
                              value={generationPercentage.fourthGen.toString()}
                              onChange={(e) =>
                                setGenerationPercentage((prev) => ({
                                  ...prev, // Spread the previous state
                                  fourthGen: Number(e.target.value), // Update only the firstGen field
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            5th Gen
                          </Label>
                          <div className="relative col-span-3">
                            {/* Peso Icon */}
                            <IconPercentage className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                              id="amount"
                              className="pl-9"
                              defaultValue={generationPercentage.fifthGen.toString()}
                              onChange={(e) =>
                                setGenerationPercentage((prev) => ({
                                  ...prev, // Spread the previous state
                                  fifthGen: Number(e.target.value), // Update only the firstGen field
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4 py-4">
                        {/* Amount Input Section */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            6th Gen
                          </Label>
                          <div className="relative col-span-3">
                            {/* Peso Icon */}
                            <IconPercentage className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                              id="amount"
                              className="pl-9"
                              value={generationPercentage.sixthGen.toString()}
                              onChange={(e) =>
                                setGenerationPercentage((prev) => ({
                                  ...prev, // Spread the previous state
                                  sixthGen: Number(e.target.value), // Update only the firstGen field
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            7th Gen
                          </Label>
                          <div className="relative col-span-3">
                            {/* Peso Icon */}
                            <IconPercentage className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                              id="amount"
                              className="pl-9"
                              value={generationPercentage.seventhGen.toString()}
                              onChange={(e) =>
                                setGenerationPercentage((prev) => ({
                                  ...prev, // Spread the previous state
                                  seventhGen: Number(e.target.value), // Update only the firstGen field
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            8th Gen
                          </Label>
                          <div className="relative col-span-3">
                            {/* Peso Icon */}
                            <IconPercentage className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                              id="amount"
                              className="pl-9"
                              value={generationPercentage.eightGen.toString()}
                              onChange={(e) =>
                                setGenerationPercentage((prev) => ({
                                  ...prev, // Spread the previous state
                                  eightGen: Number(e.target.value), // Update only the firstGen field
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            9th Gen
                          </Label>
                          <div className="relative col-span-3">
                            {/* Peso Icon */}
                            <IconPercentage className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                              id="amount"
                              className="pl-9"
                              value={generationPercentage.ninthGen.toString()}
                              onChange={(e) =>
                                setGenerationPercentage((prev) => ({
                                  ...prev, // Spread the previous state
                                  ninthGen: Number(e.target.value), // Update only the firstGen field
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            10th Gen
                          </Label>
                          <div className="relative col-span-3">
                            {/* Peso Icon */}
                            <IconPercentage className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                              id="amount"
                              className="pl-9"
                              value={generationPercentage.tenthGen.toString()}
                              onChange={(e) =>
                                setGenerationPercentage((prev) => ({
                                  ...prev, // Spread the previous state
                                  tenthGen: Number(e.target.value), // Update only the firstGen field
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button className="w-full" onClick={handleChangeAmount}>
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                {employees.map((employee, index) => (
                  <Card className="w-full">
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-primary">
                              Product
                            </h3>
                            <p className="text-sm font-medium">
                              {employee.product_name}
                            </p>
                          </div>
                          <div className="text-right">
                            <h3 className="text-lg font-semibold text-primary">
                              Card Number
                            </h3>
                            <p className="text-sm font-medium">
                              {employee.card_number}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-primary">
                              Voucher Code
                            </h3>
                            <p className="text-sm font-medium">
                              {employee.voucher_code}
                            </p>
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
                      </div>
                    </CardContent>

                    {/* Footer with Edit & Delete Buttons */}
                    <CardFooter className="flex justify-end items-center space-x-2 p-6 pt-0">
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

export default TelevisionCreation;
