import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckSquare, XSquare, Search, User, Shield, Package, Check, X } from "lucide-react";
import { toast } from "sonner";
import ExportButton from "../../components/ExportButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const RolesManagementPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { users, roles, modules, getModuleRoles, assignRoleToAgent, removeRoleFromAgent } = useData();
  
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Get modules managed by this manager
  const managedModules = currentUser?.modules 
    ? modules.filter((module) => currentUser.modules?.includes(module.id))
    : [];
  
  // Get roles for the managed modules
  const managedRoles = roles.filter((role) => 
    managedModules.some((module) => module.id === role.moduleId)
  );
  
  // Get agents
  const agents = users.filter((user) => user.role === "agent");
  
  const isRoleAssigned = (agentId: number, roleId: number) => {
    const agent = users.find((user) => user.id === agentId);
    return agent?.assignedRoles?.includes(roleId) || false;
  };
  
  const handleAssignRole = (agentId: number, roleId: number) => {
    assignRoleToAgent(agentId, roleId);
    toast.success("Rôle attribué à l'agent");
  };
  
  const handleRemoveRole = (agentId: number, roleId: number) => {
    removeRoleFromAgent(agentId, roleId);
    toast.success("Rôle retiré de l'agent");
  };
  
  // Export data
  const exportData = agents.flatMap((agent) => {
    const assignedRoles = agent.assignedRoles || [];
    
    return assignedRoles.map((roleId) => {
      const role = roles.find((r) => r.id === roleId);
      const module = modules.find((m) => m.id === role?.moduleId);
      
      return {
        "ID Agent": agent.id,
        "Nom Agent": agent.username,
        "ID Rôle": roleId,
        "Nom Rôle": role?.name || "N/A",
        "Libellé Rôle": role?.label || "N/A",
        "Module": module?.name || "N/A"
      };
    });
  });

  // Filter agents by search term
  const filteredAgents = agents.filter(agent => 
    agent.username.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-2xl font-bold">Gestion des Rôles</h2>
          <p className="text-sm text-gray-500 mt-1">Attribuez et gérez les rôles des agents par module</p>
        </div>
        <ExportButton data={exportData} filename="agents-roles" />
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
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Rechercher un agent..." 
                  className="pl-8 mb-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {filteredAgents.map(agent => (
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
                          {(agent.assignedRoles || []).length} rôles assignés
                        </div>
                      </div>
                      {selectedAgent === agent.id && (
                        <Badge variant="outline" className="bg-primary/10">Actif</Badge>
                      )}
                    </div>
                  ))}
                  {filteredAgents.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      Aucun agent trouvé
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
        
        {selectedAgent ? (
          <Card className="md:col-span-2">
            <CardHeader className="border-b">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2">
                  <Shield size={18} />
                  <span>Rôles pour {selectedAgentData?.username}</span>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="p-4">
                  {managedModules.map((module) => {
                    const moduleRoles = getModuleRoles(module.id);
                    if (moduleRoles.length === 0) return null;
                    
                    return (
                      <div key={module.id} className="mb-6">
                        <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md mb-2">
                          <Package size={16} />
                          <h3 className="font-semibold">{module.name}</h3>
                        </div>
                        <div className="rounded-md border overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[30%]">Rôle</TableHead>
                                <TableHead className="w-[50%]">Libellé</TableHead>
                                <TableHead className="w-[20%] text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {moduleRoles.map((role) => {
                                const isAssigned = isRoleAssigned(selectedAgent, role.id);
                                return (
                                  <TableRow key={role.id}>
                                    <TableCell className="font-medium">{role.name}</TableCell>
                                    <TableCell>{role.label}</TableCell>
                                    <TableCell className="text-right">
                                      {isAssigned ? (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-red-600 border-red-200 hover:bg-red-50"
                                          onClick={() => handleRemoveRole(selectedAgent, role.id)}
                                        >
                                          <X size={16} className="mr-1" /> Retirer
                                        </Button>
                                      ) : (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-green-600 border-green-200 hover:bg-green-50"
                                          onClick={() => handleAssignRole(selectedAgent, role.id)}
                                        >
                                          <Check size={16} className="mr-1" /> Attribuer
                                        </Button>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <Card className="md:col-span-2">
            <div className="flex flex-col items-center justify-center p-10 text-center gap-3">
              <div className="rounded-full bg-primary/10 p-4">
                <Shield size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Sélectionner un agent</h3>
              <p className="text-sm text-gray-500 max-w-md">
                Veuillez sélectionner un agent dans la liste pour afficher et gérer ses attributions de rôles.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RolesManagementPage;