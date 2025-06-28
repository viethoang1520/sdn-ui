import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface TicketTypeSelectionProps {
  ticketTypes: TicketType[];
  selectedTicketType: string;
  onSelect: (ticketId: string) => void;
  formatCurrency: (amount: number) => string;
}

const TicketTypeSelection: React.FC<TicketTypeSelectionProps> = ({
  ticketTypes,
  selectedTicketType,
  onSelect,
  formatCurrency,
}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {ticketTypes.map((ticket) => (
        <Card
          key={ticket.id}
          className={`cursor-pointer transition-all ${selectedTicketType === ticket.id ? "border-primary ring-2 ring-primary" : "hover:border-primary/50"}`}
          onClick={() => onSelect(ticket.id)}
        >
          <CardHeader>
            <CardTitle>{ticket.name}</CardTitle>
            <CardDescription>{formatCurrency(ticket.price)}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{ticket.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default TicketTypeSelection; 