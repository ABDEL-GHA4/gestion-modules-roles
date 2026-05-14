import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import Layout from "../../components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Box, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const AgentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { getAgentRoles, getAgentModules, getRolesByModuleId } = useData();
  
  const agentModules = currentUser ? getAgentModules(currentUser.id) : [];
  
  // État pour suivre les modules développés
  const [expandedModules, setExpandedModules] = React.useState<number[]>([]);

  const toggleModuleExpand = (moduleId: number) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId) 
        : [...prev, moduleId]
    );
  };

  const getAgentRolesForModule = (moduleId: number) => {
    if (!currentUser) return [];
    const allAgentRoles = getAgentRoles(currentUser.id);
    return allAgentRoles.filter(role => role.moduleId === moduleId);
  };
  

  return (
    <Layout title="Tableau de Bord Agent">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold">Mon Tableau de Bord</h1>
        
        {/* Modules avec leurs rôles associés */}
        <Card className="border-gray-200 shadow-md">
          <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <Box className="text-gray-700" />
              <CardTitle className="text-gray-900">Mes Applications et Rôles</CardTitle>
              <Badge variant="outline" className="bg-gray-100 text-gray-700">{agentModules.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {agentModules.length > 0 ? (
              agentModules.map(module => {
                const moduleRoles = getAgentRolesForModule(module.id);
                const isExpanded = expandedModules.includes(module.id);
                
                return (
                  <Collapsible 
                    key={module.id} 
                    className="border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md"
                    open={isExpanded}
                  >
                    <CollapsibleTrigger 
                      className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-black hover:text-white cursor-pointer transition-colors duration-300"
                      onClick={() => toggleModuleExpand(module.id)}
                    >
                      <div className="font-medium flex items-center gap-2">
                        <Box className="h-5 w-5" />
                        {module.name}
                        <span className="text-sm font-normal ml-2">
                          (ID: {module.id})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-gray-200 text-gray-800 hover:bg-gray-100">
                          {moduleRoles.length} {moduleRoles.length > 1 ? 'rôles' : 'rôle'}
                        </Badge>
                        <ChevronRight 
                          className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'transform rotate-90' : ''}`}
                        />
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="border-t">
                      <div className="p-4 bg-white space-y-3">
                        <h3 className="font-medium text-gray-700 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-gray-600" />
                          Rôles associés à ce module:
                        </h3>
                        
                        {moduleRoles.length > 0 ? (
                          <div className="grid gap-3 mt-2">
                            {moduleRoles.map(role => (
                              <div 
                                key={role.id} 
                                className="border rounded-md p-3 hover:bg-gray-50 transition-colors duration-200"
                              >
                                <div className="font-medium flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-gray-600" />
                                  {role.name}
                                </div>
                                <div className="mt-1 text-sm text-gray-600">
                                  {role.label}
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                  ID du rôle: {role.id}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-3 text-gray-500 italic">
                            Aucun rôle attribué pour ce module
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucune application attribuée
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};


export default AgentDashboard;