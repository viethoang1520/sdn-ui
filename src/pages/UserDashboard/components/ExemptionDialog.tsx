import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserStore } from "@/store/userStore";
import { AlertCircle } from "lucide-react";
import React, { useEffect } from "react";

interface ExemptionDialogProps {
  open: boolean;
  onClose: () => void;
  exemptionForm: {
    priorityGroup: string;
    cccd: string;
    validTo?: { month: string; year: string };
  };
  setExemptionForm: (form: { priorityGroup: string; cccd: string; validTo?: { month: string; year: string } }) => void;
  exemptionStatus: { type: "success" | "error" | null; message: string };
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
  handleExemptionSubmit,
  isFormValid,
  priorityGroups,
}) => {
  // Get user data from Zustand store
  const user = useUserStore((state) => state.user);
  const userName = useUserStore((state) => state.user?.full_name);
  const userCCCD = useUserStore((state) => state.user?.cccd);
  const passengerCategories = useUserStore((state) => state.user?.passenger_categories);

  // Check if user already has an active discount
  const hasActiveDiscount = passengerCategories &&
    passengerCategories.status === 'APPROVED' &&
    passengerCategories.discount > 0;

  // Get current passenger type to determine allowed reapplications
  const currentPassengerType = passengerCategories?.passenger_type;

  // Determine which priority groups are allowed based on current status
  const getAllowedPriorityGroups = () => {
    if (!hasActiveDiscount || !currentPassengerType) {
      // No current discount, allow all options
      return priorityGroups;
    }

    switch (currentPassengerType) {
      case 'SENIOR':
        // Seniors cannot reapply as students (age restriction) or children (age restriction)
        // They can only reapply for veteran status if applicable
        return priorityGroups.filter(group =>
          group.value !== 'student' && group.value !== 'child'
        );

      case 'CHILD':
        // Children can reapply to become students or seniors (they grow up)
        // They cannot reapply as veterans (military service requirement)
        return priorityGroups.filter(group => group.value !== 'veteran');

      case 'VETERAN':
        // Veterans can reapply for senior status if age-appropriate
        // They cannot reapply as students (age restriction) or children (age restriction)
        return priorityGroups.filter(group =>
          group.value !== 'student' && group.value !== 'child'
        );

      case 'STUDENT':
        // Students can apply for other categories if eligible
        // They cannot apply for child status (age progression)
        // They can apply for veteran (if they serve) or senior (if they age)
        return priorityGroups.filter(group => group.value !== 'child');

      default:
        return priorityGroups;
    }
  };

  const allowedPriorityGroups = getAllowedPriorityGroups();

  // Get restriction message for disabled options
  const getRestrictionMessage = () => {
    if (!hasActiveDiscount || !currentPassengerType) return null;

    switch (currentPassengerType) {
      case 'SENIOR':
        return "Người cao tuổi không thể đăng ký ưu đãi sinh viên hoặc trẻ em";
      case 'VETERAN':
        return "Cựu chiến binh không thể đăng ký ưu đãi sinh viên hoặc trẻ em";
      case 'CHILD':
        return "Trẻ em không thể đăng ký ưu đãi cựu chiến binh";
      case 'STUDENT':
        return "Sinh viên không thể đăng ký ưu đãi trẻ em";
      default:
        return null;
    }
  };

  const restrictionMessage = getRestrictionMessage();

  // Check if current selection violates constraints
  const hasSelectionViolation = () => {
    // If no active discount, no violations possible
    if (!hasActiveDiscount || !currentPassengerType || !exemptionForm.priorityGroup) {
      return false;
    }

    // Debug logging
    console.log('Debug - Constraint Check:', {
      currentPassengerType,
      selectedGroup: exemptionForm.priorityGroup,
      allowedGroups: allowedPriorityGroups.map(g => g.value),
      hasActiveDiscount
    });

    // Check if the selected priority group is in the allowed list
    const isAllowed = allowedPriorityGroups.some(group => group.value === exemptionForm.priorityGroup);
    console.log('Debug - Is selection allowed:', isAllowed);

    return !isAllowed;
  };

  const isViolating = hasSelectionViolation();

  // Enhanced form validation including constraint violations
  const isFormValidWithConstraints = isFormValid && !isViolating;

  // Pre-fill CCCD field when dialog opens and user has CCCD
  useEffect(() => {
    if (open && userCCCD && !exemptionForm.cccd) {
      setExemptionForm({
        ...exemptionForm,
        cccd: userCCCD
      });
    }
  }, [open, userCCCD, exemptionForm, setExemptionForm]);

  // Reset form if selected priority group is not allowed
  useEffect(() => {
    if (exemptionForm.priorityGroup &&
      !allowedPriorityGroups.some(group => group.value === exemptionForm.priorityGroup)) {
      setExemptionForm({
        ...exemptionForm,
        priorityGroup: ""
      });
    }
  }, [exemptionForm, allowedPriorityGroups, setExemptionForm]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nộp đơn xin miễn/giảm vé</DialogTitle>
          <DialogDescription>
            {userName ? (
              <>Xin chào <strong>{userName}</strong>, vui lòng chọn loại đối tượng ưu tiên và kiểm tra thông tin của bạn</>
            ) : (
              "Vui lòng chọn loại đối tượng ưu tiên và nhập số căn cước công dân"
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Show existing discount status */}
          {hasActiveDiscount && (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Bạn đã có ưu đãi hiện tại:</strong><br />
                • Loại: {passengerCategories?.passenger_type}<br />
                • Giảm giá: {passengerCategories?.discount}%<br />
                • Hết hạn: {passengerCategories?.expiry_date ? new Date(passengerCategories.expiry_date).toLocaleDateString('vi-VN') : 'Vĩnh viễn'}<br />
                <em>Nộp đơn mới sẽ thay thế ưu đãi hiện tại</em>
                {restrictionMessage && (
                  <>
                    <br />
                    <strong className="text-orange-700">⚠ Hạn chế: {restrictionMessage}</strong>
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

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
                {allowedPriorityGroups.map((group) => (
                  <SelectItem key={group.value} value={group.value}>
                    {group.label}
                  </SelectItem>
                ))}
                {/* Show disabled options with explanation */}
                {priorityGroups
                  .filter(group => !allowedPriorityGroups.includes(group))
                  .map((group) => (
                    <SelectItem
                      key={group.value}
                      value={group.value}
                      disabled
                      className="text-gray-400"
                    >
                      {group.label} (Không khả dụng)
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            {restrictionMessage && (
              <p className="text-xs text-orange-600">
                ⚠ {restrictionMessage}
              </p>
            )}
            {isViolating && (
              <p className="text-xs text-red-600 font-medium">
                ❌ Lựa chọn không hợp lệ - Vui lòng chọn loại đối tượng khác
              </p>
            )}
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
            <Label htmlFor="cccd">
              Số căn cước công dân *
              {userCCCD && (
                <span className="text-xs text-green-600 ml-1">(Đã lấy từ tài khoản)</span>
              )}
            </Label>
            <Input
              id="cccd"
              type="text"
              placeholder="Nhập số CCCD"
              value={exemptionForm.cccd}
              onChange={(e) => setExemptionForm({ ...exemptionForm, cccd: e.target.value })}
              maxLength={12}
              pattern="[0-9]*"
              inputMode="numeric"
              className={userCCCD ? "bg-gray-50" : ""}
            />
            {userCCCD && exemptionForm.cccd === userCCCD && (
              <p className="text-xs text-green-600">
                ✓ Số CCCD khớp với thông tin tài khoản
              </p>
            )}
            {userCCCD && exemptionForm.cccd !== userCCCD && exemptionForm.cccd.length > 0 && (
              <p className="text-xs text-yellow-600">
                ⚠ Số CCCD khác với thông tin tài khoản ({userCCCD})
              </p>
            )}
          </div>
          {exemptionForm.priorityGroup && (
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Mức ưu đãi:</strong>{" "}
                {allowedPriorityGroups.find((g) => g.value === exemptionForm.priorityGroup)?.discount === "100%"
                  ? "Miễn phí"
                  : "Giảm 50%"}
              </p>
            </div>
          )}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {/* Show validation summary if there are constraint violations */}
          {isViolating && (
            <div className="w-full mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">
                <strong>❌ Không thể nộp đơn:</strong><br />
                Loại đối tượng bạn chọn không phù hợp với trạng thái hiện tại.
                Vui lòng chọn một trong các loại được phép hoặc hủy để đóng hộp thoại.
              </p>
            </div>
          )}
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              setExemptionForm({ priorityGroup: "", cccd: "", validTo: undefined });
            }}
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
          <Button
            onClick={handleExemptionSubmit}
            disabled={!isFormValidWithConstraints || exemptionStatus.type === "success"}
            className={`w-full sm:w-auto ${isViolating
                ? "bg-red-400 hover:bg-red-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {exemptionStatus.type === "success"
              ? "Đã nộp"
              : isViolating
                ? "Lựa chọn không hợp lệ"
                : "Nộp đơn"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExemptionDialog;
