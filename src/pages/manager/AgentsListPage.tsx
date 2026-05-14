
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ExportButton from "../../components/ExportButton";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AgentsListPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { users, modules, roles } = useData();
  
  const [selectedAgent, setSelectedAgent] = React.useState<number | null>(null);
  
  // Get modules managed by this manager
  const managedModules = currentUser?.modules 
    ? modules.filter((module) => currentUser.modules?.includes(module.id))
    : [];
  
  // Get agents
  const agents = users.filter((user) => user.role === "agent");
  
  // Get roles for an agent that are related to the modules managed by this manager
  const getAgentManagedRoles = (agentId: number) => {
    const agent = users.find((user) => user.id === agentId);
    if (!agent || !agent.assignedRoles) return [];
    
    return roles.filter((role) => 
      agent.assignedRoles?.includes(role.id) && 
      managedModules.some((module) => module.id === role.moduleId)
    );
  };
  
  // Export data
  const exportData = agents.map((agent) => {
    const agentRoles = getAgentManagedRoles(agent.id);
    
    return {
      "ID": agent.id,
      "Nom d'utilisateur": agent.username,
      "Nombre de rôles": agentRoles.length
    };
  });
  
  const selectedAgentData = selectedAgent ? users.find(u => u.id === selectedAgent) : null;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Liste des Agents</h2>
        <ExportButton data={exportData} filename="liste-agents" />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Agents avec rôles attribués</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom d'utilisateur</TableHead>
                <TableHead>Rôles attribués</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => {
                const agentRoles = getAgentManagedRoles(agent.id);
                
                return (
                  <TableRow key={agent.id}>
                    <TableCell>{agent.id}</TableCell>
                    <TableCell>{agent.username}</TableCell>
                    <TableCell>{agentRoles.length}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedAgent(agent.id)}
                      >
                        <Eye size={16} className="mr-1" /> Voir les rôles
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={selectedAgent !== null} onOpenChange={(open) => !open && setSelectedAgent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Rôles attribués à {selectedAgentData?.username}
            </DialogTitle>
          </DialogHeader>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Libellé</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedAgent && getAgentManagedRoles(selectedAgent).map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    {modules.find((m) => m.id === role.moduleId)?.name || "N/A"}
                  </TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.label}</TableCell>
                </TableRow>
              ))}
              {selectedAgent && getAgentManagedRoles(selectedAgent).length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Aucun rôle attribué pour les modules que vous gérez
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentsListPage;
