import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ExemptionDialogProps {
  open: boolean;
  onClose: () => void;
  exemptionForm: {
    priorityGroup: string;
    documents: File[];
    validTo?: { month: string; year: string };
  };
  setExemptionForm: (form: { priorityGroup: string; documents: File[]; validTo?: { month: string; year: string } }) => void;
  exemptionStatus: { type: "success" | "error" | null; message: string };
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeDocument: (index: number) => void;
  handleExemptionSubmit: () => void;
  isFormValid: boolean;
  priorityGroups: { value: string; label: string; discount: string }[];
}

const ExemptionDialog: React.FC<ExemptionDialogProps> = ({
  open,
  onClose,
  exemptionForm,
  setExemptionForm,
  exemptionStatus,
  handleFileUpload,
  removeDocument,
  handleExemptionSubmit,
  isFormValid,
  priorityGroups,
}) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Nộp đơn xin miễn/giảm vé</DialogTitle>
        <DialogDescription>
          Vui lòng chọn loại đối tượng ưu tiên và đính kèm tài liệu chứng minh
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-6">
        {exemptionStatus.type && (
          <Alert
            className={
              exemptionStatus.type === "success"
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }
          >
            <AlertCircle
              className={`h-4 w-4 ${exemptionStatus.type === "success" ? "text-green-600" : "text-red-600"}`}
            />
            <AlertDescription
              className={
                exemptionStatus.type === "success"
                  ? "text-green-800"
                  : "text-red-800"
              }
            >
              {exemptionStatus.message}
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="priority-group">Loại đối tượng ưu tiên *</Label>
          <Select
            value={exemptionForm.priorityGroup}
            onValueChange={(value) =>
              setExemptionForm({ ...exemptionForm, priorityGroup: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại đối tượng" />
            </SelectTrigger>
            <SelectContent>
              {priorityGroups.map((group) => (
                <SelectItem key={group.value} value={group.value}>
                  {group.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="valid-to">
            Thời hạn hiệu lực *{" "}
            <span className="text-xs text-red-500">
              (Giữ mặc định nếu bạn thuộc diện miễn phí)
            </span>
          </Label>
          <div className="flex gap-2">
            <Select
              value={exemptionForm.validTo?.month || ""}
              onValueChange={(month) =>
                setExemptionForm({
                  ...exemptionForm,
                  validTo: { month, year: exemptionForm.validTo?.year || "" },
                })
              }
            >
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Tháng" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(12)].map((_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1).padStart(2, "0")}>{`Tháng ${i + 1}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={exemptionForm.validTo?.year || ""}
              onValueChange={(year) =>
                setExemptionForm({
                  ...exemptionForm,
                  validTo: { month: exemptionForm.validTo?.month || "", year },
                })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Năm" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() + i;
                  return (
                    <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="documents">Tài liệu chứng minh *</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Nhấn để tải lên</span> hoặc kéo thả file
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF (tối đa 10MB mỗi file)</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
            {exemptionForm.documents.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Tài liệu đã chọn:</p>
                {exemptionForm.documents.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {exemptionForm.priorityGroup && (
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Mức ưu đãi:</strong>{" "}
              {priorityGroups.find((g) => g.value === exemptionForm.priorityGroup)?.discount === "100%"
                ? "Miễn phí"
                : "Giảm 50%"}
            </p>
          </div>
        )}
      </div>
      <DialogFooter className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          onClick={() => {
            onClose();
            setExemptionForm({ priorityGroup: "", documents: [], validTo: undefined });
          }}
          className="w-full sm:w-auto"
        >
          Hủy
        </Button>
        <Button
          onClick={handleExemptionSubmit}
          disabled={!isFormValid || exemptionStatus.type === "success"}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
        >
          {exemptionStatus.type === "success" ? "Đã nộp" : "Nộp đơn"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ExemptionDialog;
