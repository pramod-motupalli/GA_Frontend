import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Mail, Phone, User2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function CreateClientModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [connectionDate, setConnectionDate] = useState<Date | undefined>();
  const [domainExpire, setDomainExpire] = useState<Date | undefined>();
  const [hostingExpire, setHostingExpire] = useState<Date | undefined>();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Client and workspace</DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">1</div>
            <span>Creating user</span>
          </div>
          <div className="flex-1 border-t border-dashed border-gray-300"></div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 text-blue-500 flex items-center justify-center">2</div>
            <span>Creating Workspace</span>
          </div>
        </div>

        {/* Client Info */}
        <section className="space-y-4 border p-4 rounded-md">
          <h4 className="font-semibold text-sm">Client Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Name" icon={<User2 />} />
            <Input placeholder="Email id" icon={<Mail />} />
            <Input placeholder="Contact number" icon={<Phone />} />
            <Popover>
              <PopoverTrigger asChild>
                <div>
                  <Input
                    placeholder="Connection Date with us"
                    value={connectionDate ? format(connectionDate, "PPP") : ""}
                    readOnly
                    icon={<CalendarIcon />}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={connectionDate} onSelect={setConnectionDate} />
              </PopoverContent>
            </Popover>
          </div>
        </section>

        {/* Domain Info */}
        <section className="space-y-4 border p-4 rounded-md">
          <h4 className="font-semibold text-sm">Domain Related information</h4>
          <Input placeholder="Domain Name" />
          <div className="grid grid-cols-3 gap-4">
            <Input placeholder="Domain Provider" />
            <Input placeholder="Domain account" />
            <Popover>
              <PopoverTrigger asChild>
                <div>
                  <Input
                    placeholder="Expire Date"
                    value={domainExpire ? format(domainExpire, "PPP") : ""}
                    readOnly
                    icon={<CalendarIcon />}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={domainExpire} onSelect={setDomainExpire} />
              </PopoverContent>
            </Popover>
          </div>
        </section>

        {/* Hosting Info */}
        <section className="space-y-4 border p-4 rounded-md">
          <h4 className="font-semibold text-sm">Hosting Related information</h4>
          <div className="grid grid-cols-3 gap-4">
            <Input placeholder="Hosting Provider" />
            <Input placeholder="Hosting Provider Name" />
            <Popover>
              <PopoverTrigger asChild>
                <div>
                  <Input
                    placeholder="Expire Date"
                    value={hostingExpire ? format(hostingExpire, "PPP") : ""}
                    readOnly
                    icon={<CalendarIcon />}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={hostingExpire} onSelect={setHostingExpire} />
              </PopoverContent>
            </Popover>
          </div>
        </section>

        {/* H&D Maintenance */}
        <section className="border p-4 rounded-md">
          <h4 className="font-semibold text-sm mb-2">H&D Maintenance</h4>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </section>

        {/* Footer */}
        <DialogFooter className="mt-4 flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>cancel</Button>
          <Button>Continue to workspace</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
