import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from 'lucide-react';

export function JobFilters({ 
  searchTerm, 
  onSearchChange, 
  locationFilter, 
  onLocationChange,
  onRefresh,
  isLoading 
}) {
  return (
    <Card className="border-2">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Find Your Next Role</CardTitle>
          <Button
            variant="outline"
            size="lg"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 transition-all hover:shadow-md"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Syncing Jobs...' : 'Refresh Jobs'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search job titles, companies, or keywords..."
            className="pl-12 h-12 text-lg transition-all focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Select value={locationFilter} onValueChange={onLocationChange}>
          <SelectTrigger className="h-12 text-lg">
            <SelectValue placeholder="Choose work location preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="remote">🌐 Remote</SelectItem>
            <SelectItem value="hybrid">🏢 Hybrid</SelectItem>
            <SelectItem value="onsite">📍 On-site</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}