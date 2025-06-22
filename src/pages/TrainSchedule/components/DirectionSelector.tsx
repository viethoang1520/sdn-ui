import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight } from "lucide-react"
import React from "react"

interface DirectionSelectorTranslations {
  selectDirection: string
  benThanhToSuoiTien: string
  suoiTienToBenThanh: string
}

interface DirectionSelectorProps {
  t: DirectionSelectorTranslations
  selectedDirection: string
  setSelectedDirection: (value: string) => void
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
          <SelectItem value="Bến Thành - Suối Tiên">{t.benThanhToSuoiTien}</SelectItem>
          <SelectItem value="Suối Tiên - Bến Thành">{t.suoiTienToBenThanh}</SelectItem>
        </SelectContent>
      </Select>
    </CardContent>
  </Card>
)

export default DirectionSelector