// src/components/features/connections/components/connection-filters.jsx

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from 'lucide-react';

export function ConnectionFilters({ 
  searchTerm, 
  onSearchChange, 
  companyFilter, 
  onCompanyChange,
  companies = [] 
}) {
  return (
    <Card className="border-2">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-2xl font-bold">Find Connections</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, title, or company..."
            className="pl-12 h-12 text-lg transition-all focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Select value={companyFilter} onValueChange={onCompanyChange}>
          <SelectTrigger className="h-12 text-lg">
            <SelectValue placeholder="Filter by company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {companies.sort().map((company) => (
              <SelectItem key={company} value={company}>
                {company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}