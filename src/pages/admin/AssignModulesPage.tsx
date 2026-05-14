import React, { useState } from "react";
import { useData } from "../../contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ExportButton from "../../components/ExportButton";
import { Search, Filter, User, Package, CheckCircle, XCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const AssignModulesPage: React.FC = () => {
  const { users, modules, assignModuleToAgent, removeModuleFromAgent, agentModules } = useData();
  
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [view, setView] = useState<"grid" | "list">("list");
  
  // const agents = users.filter((user) => user.role === "agent");  
  const agents = users.filter((user) => user.role === "manager");
  
  const isModuleAssigned = (agentId: number, moduleId: number) => {
    return agentModules.some(
      (am) => am.agentId === agentId && am.moduleId === moduleId
    );
  };
  
  const handleModuleToggle = (moduleId: number) => {
    if (!selectedAgent) return;
    
    if (isModuleAssigned(selectedAgent, moduleId)) {
      removeModuleFromAgent(selectedAgent, moduleId);
      toast.success("Module retiré de l'agent");
    } else {
      assignModuleToAgent(selectedAgent, moduleId);
      toast.success("Module assigné à l'agent");
    }
  };
  
  // Data for export
  const exportData = agentModules.map((am) => {
    const agent = users.find((u) => u.id === am.agentId);
    const module = modules.find((m) => m.id === am.moduleId);
    
    return {
      "ID Agent": am.agentId,
      "Nom Agent": agent?.username || "N/A",
      "ID Module": am.moduleId,
      "Nom Module": module?.name || "N/A"
    };
  });

  // Filter modules based on search
  const filteredModules = modules.filter(module => 
    module.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  const selectedAgentData = users.find(u => u.id === selectedAgent);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Attribution des Modules aux Agents</h2>
          <p className="text-sm text-gray-500 mt-1">Gérez les accès aux modules pour chaque agent</p>
        </div>
        <ExportButton data={exportData} filename="modules-agents" />
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={18} />
              <span>Agents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input 
                placeholder="Rechercher un agent..." 
                className="mb-3"
              />
              <div className="space-y-2">
                {agents.map(agent => (
                  <div 
                    key={agent.id}
                    className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                      selectedAgent === agent.id ? "bg-primary/10 border border-primary/30" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedAgent(agent.id)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {getInitials(agent.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{agent.username}</div>
                      <div className="text-xs text-gray-500">
                        {agentModules.filter(am => am.agentId === agent.id).length} modules
                      </div>
                    </div>
                    {selectedAgent === agent.id && (
                      <Badge variant="outline" className="bg-primary/10">Sélectionné</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {selectedAgent ? (
          <Card className="md:col-span-2">
            <CardHeader className="border-b">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Package size={18} />
                  <span>Modules pour {selectedAgentData?.username}</span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Rechercher un module..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant={view === "list" ? "default" : "outline"}
                      onClick={() => setView("list")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                      </svg>
                    </Button>
                    <Button
                      size="icon"
                      variant={view === "grid" ? "default" : "outline"}
                      onClick={() => setView("grid")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {view === "list" ? (
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white">
                      <TableRow>
                        <TableHead>Module</TableHead>
                        <TableHead className="w-[120px] text-center">ID</TableHead>
                        <TableHead className="w-[120px] text-center">Statut</TableHead>
                        <TableHead className="w-[100px] text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredModules.length > 0 ? (
                        filteredModules.map((module) => {
                          const isAssigned = isModuleAssigned(selectedAgent, module.id);
                          return (
                            <TableRow key={module.id}>
                              <TableCell className="font-medium">{module.name}</TableCell>
                              <TableCell className="text-center">{module.id}</TableCell>
                              <TableCell className="text-center">
                                {isAssigned ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Assigné
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                                    Non assigné
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Checkbox
                                  checked={isAssigned}
                                  onCheckedChange={() => handleModuleToggle(module.id)}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            Aucun module trouvé
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[400px] overflow-auto p-1">
                  {filteredModules.length > 0 ? (
                    filteredModules.map((module) => {
                      const isAssigned = isModuleAssigned(selectedAgent, module.id);
                      return (
                        <Card key={module.id} className={`border ${isAssigned ? 'border-primary/30' : ''}`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-medium mb-1">{module.name}</div>
                                <div className="text-xs text-gray-500">ID: {module.id}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                {isAssigned ? (
                                  <CheckCircle size={16} className="text-green-600" />
                                ) : (
                                  <XCircle size={16} className="text-gray-400" />
                                )}
                                <Checkbox
                                  checked={isAssigned}
                                  onCheckedChange={() => handleModuleToggle(module.id)}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="col-span-full flex items-center justify-center h-full text-gray-500">
                      Aucun module trouvé
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="md:col-span-2">
            <div className="flex flex-col items-center justify-center p-10 text-center gap-3">
              <div className="rounded-full bg-primary/10 p-4">
                <Package size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Sélectionner un agent</h3>
              <p className="text-sm text-gray-500 max-w-md">
                Veuillez sélectionner un agent dans la liste pour afficher et gérer ses attributions de modules.
              </p>
            </div>
          </Card>
        )
        }
      </div>
    </div>
  );
};

export default AssignModulesPage;