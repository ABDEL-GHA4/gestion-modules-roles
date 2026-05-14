import React, { useState } from "react";
import { useData } from "../../contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import ExportButton from "../../components/ExportButton";
import { Search, BookOpen, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../contexts/AuthContext";



const ManagerConsultationModules = () => {
  const { currentUser } = useAuth();
  const { modules, agentModules } = useData();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("list");
  
  // Filter modules based on search
  const filteredModules = modules.filter(module => 
    module.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Check if a module is assigned to any agent
 const isModuleAssigned = (moduleId: number) => {
  if (!currentUser) return false;
  return agentModules.some(am => am.agentId === currentUser.id && am.moduleId === moduleId);
};

  
  // Data for export
  const exportData = modules.map((module) => {
    return {
      "ID": module.id,
      "Nom du Module": module.name,
      "Statut": isModuleAssigned(module.id) ? "Assigné" : "Non assigné"
    };
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Consultation des Modules</h2>
          <p className="text-sm text-gray-500 mt-1">Visualisez tous les modules disponibles sur la plateforme</p>
        </div>
        <ExportButton data={exportData} filename="liste-modules" />
      </div>
      
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={18} />
              <span>Modules Disponibles</span>
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
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead className="w-[120px] text-center">ID</TableHead>
                    <TableHead className="w-[120px] text-center">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModules.length > 0 ? (
                    filteredModules.map((module) => {
                      const assigned = isModuleAssigned(module.id);
                      return (
                        <TableRow key={module.id}>
                          <TableCell className="font-medium">{module.name}</TableCell>
                          <TableCell className="text-center">{module.id}</TableCell>
                          <TableCell className="text-center">
                            {assigned ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Assigné
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                                Non assigné
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">
                        Aucun module trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 h-[500px] overflow-auto p-1">
              {filteredModules.length > 0 ? (
                filteredModules.map((module) => {
                  const assigned = isModuleAssigned(module.id);
                  return (
                    <Card key={module.id} className={`border ${assigned ? 'border-green-300' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium mb-1">{module.name}</div>
                            <div className="text-xs text-gray-500">ID: {module.id}</div>
                          </div>
                          <div className="flex items-center">
                            {assigned ? (
                              <>
                                <CheckCircle size={16} className="text-green-600 mr-2" />
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Assigné
                                </Badge>
                              </>
                            ) : (
                              <>
                                <XCircle size={16} className="text-gray-400 mr-2" />
                                <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                                  Non assigné
                                </Badge>
                              </>
                            )}
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
    </div>
  );
};

export default ManagerConsultationModules;