import React from "react";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface DirectionSelectorProps {
  t: any;
  selectedDirection: string;
  setSelectedDirection: (value: string) => void;
}

const DirectionSelector: React.FC<DirectionSelectorProps> = ({ t, selectedDirection, setSelectedDirection }) => (
  <Card className="mb-8">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <ArrowRight className="h-5 w-5" />
        {t.selectDirection}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Select value={selectedDirection} onValueChange={setSelectedDirection}>
        <SelectTrigger className="w-full md:w-96">
          <SelectValue placeholder={t.selectDirection} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ben-thanh-to-suoi-tien">{t.benThanhToSuoiTien}</SelectItem>
          <SelectItem value="suoi-tien-to-ben-thanh">{t.suoiTienToBenThanh}</SelectItem>
        </SelectContent>
      </Select>
    </CardContent>
  </Card>
);

export default DirectionSelector; 