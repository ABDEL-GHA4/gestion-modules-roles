import React, { useState } from "react";
import { useData } from "../../contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash, Plus, ChevronDown, ChevronRight, Save, Check } from "lucide-react";
import ExportButton from "../../components/ExportButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const RolesPage: React.FC = () => {
  const { modules, roles, addRole, updateRole, deleteRole, getModuleRoles } = useData();
  
  // États pour les dialogues principaux
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // États pour les dialogues de confirmation
  const [isAddConfirmOpen, setIsAddConfirmOpen] = useState(false);
  const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  const [newRole, setNewRole] = useState({ name: "", label: "", moduleId: 0 });
  const [editingRole, setEditingRole] = useState<{ id: number; name: string; label: string; moduleId: number } | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null);
  
  // Modification: au lieu d'un tableau, nous utilisons un seul ID de module
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null);
  
  const handleAddRoleConfirm = () => {
    if (newRole.name.trim() === "" || newRole.label.trim() === "" || newRole.moduleId === 0) {
      toast.error("Tous les champs sont requis");
      return;
    }
    
    // Ouvrir le dialogue de confirmation au lieu d'ajouter directement
    setIsAddConfirmOpen(true);
  };
  
  const handleAddRole = () => {
    addRole(newRole);
    setNewRole({ name: "", label: "", moduleId: 0 });
    setIsAddConfirmOpen(false);
    setIsAddDialogOpen(false);
    toast.success("Rôle ajouté avec succès");
  };
  
  const handleUpdateRoleConfirm = () => {
    if (!editingRole) return;
    
    if (editingRole.name.trim() === "" || editingRole.label.trim() === "") {
      toast.error("Tous les champs sont requis");
      return;
    }
    
    // Ouvrir le dialogue de confirmation au lieu de mettre à jour directement
    setIsEditConfirmOpen(true);
  };
  
  const handleUpdateRole = () => {
    if (!editingRole) return;
    
    updateRole(editingRole.id, {
      name: editingRole.name,
      label: editingRole.label,
      moduleId: editingRole.moduleId
    });
    
    setEditingRole(null);
    setIsEditConfirmOpen(false);
    setIsEditDialogOpen(false);
    toast.success("Rôle mis à jour avec succès");
  };
  
  const openDeleteConfirm = (roleId) => {
    setRoleToDelete(roleId);
    setIsDeleteConfirmOpen(true);
  };
  
  const handleDeleteRole = () => {
    if (roleToDelete === null) return;
    
    deleteRole(roleToDelete);
    setRoleToDelete(null);
    setIsDeleteConfirmOpen(false);
    toast.success("Rôle supprimé avec succès");
  };
  
  const openEditDialog = (role) => {
    setEditingRole(role);
    setIsEditDialogOpen(true);
  };
  
  // Modification: nouvelle fonction pour gérer l'ouverture/fermeture des modules
  const toggleModuleExpand = (moduleId: number) => {
    // Si le module cliqué est déjà ouvert, on le ferme
    if (expandedModuleId === moduleId) {
      setExpandedModuleId(null);
    } else {
      // Sinon, on ferme celui qui était ouvert et on ouvre le nouveau
      setExpandedModuleId(moduleId);
    }
  };

  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestion des Rôles</h2>
        <ExportButton data={roles} filename="roles" />
      </div>
      
      <Tabs defaultValue="edit">
        <TabsList className="bg-gray-50 border border-gray-200">
          <TabsTrigger value="edit" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Mise à jour des rôles
          </TabsTrigger>
          <TabsTrigger value="view" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Consultation des rôles
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="mt-4 space-y-6">
          <Card className="border-gray-200 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <CardTitle className="text-gray-900">Liste des rôles</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-black hover:bg-gray-800 flex items-center gap-2">
                    <Plus size={16} />
                    <span>Ajouter un rôle</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md border-gray-300 shadow-lg">
                  <DialogHeader className="bg-gray-50 -m-4 p-4 rounded-t-lg">
                    <DialogTitle className="text-gray-900">Ajouter un nouveau rôle</DialogTitle>
                    <DialogDescription>
                      Complétez les informations ci-dessous pour créer un nouveau rôle.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="moduleSelect" className="text-gray-700">Module</Label>
                      <Select
                        onValueChange={(value) => setNewRole({ ...newRole, moduleId: Number(value) })}
                        value={newRole.moduleId > 0 ? String(newRole.moduleId) : undefined}
                      >
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="Sélectionner un module" />
                        </SelectTrigger>
                        <SelectContent>
                          {modules.map((module) => (
                            <SelectItem key={module.id} value={String(module.id)}>
                              {module.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="roleName" className="text-gray-700">Nom du rôle</Label>
                      <Input
                        id="roleName"
                        value={newRole.name}
                        onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                        placeholder="Ex: GST, DEV, ADM"
                        className="border-gray-300"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="roleLabel" className="text-gray-700">Libellé du rôle</Label>
                      <Input
                        id="roleLabel"
                        value={newRole.label}
                        onChange={(e) => setNewRole({ ...newRole, label: e.target.value })}
                        placeholder="Ex: Gestionnaire, Développeur"
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                  <DialogFooter className="bg-gray-50 -m-4 mt-0 p-4 rounded-b-lg">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-gray-400 text-gray-700">
                      Annuler
                    </Button>
                    <Button onClick={handleAddRoleConfirm} className="bg-black hover:bg-gray-800">
                      Continuer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Liste des rôles groupés par module */}
              {modules.map((module) => (
                <Collapsible 
                  key={module.id} 
                  className="mb-4"
                  open={expandedModuleId === module.id}
                >
                  <div className="flex items-center border border-gray-200 p-3 rounded-md bg-gray-50">
                    <CollapsibleTrigger className="flex items-center w-full" onClick={() => toggleModuleExpand(module.id)}>
                      {expandedModuleId === module.id ? (
                        <ChevronDown size={16} className="mr-2 text-gray-700" />
                      ) : (
                        <ChevronRight size={16} className="mr-2 text-gray-700" />
                      )}
                      <div >
                        <span className="text-gray-600">ID:{module.id}--</span>
                        <span className="font-medium text-gray-900">Module: {module.name}</span>
                      </div>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <div className="ml-6 mt-2 border border-gray-200 rounded-md p-3 shadow-sm">
                      <Table>
                        <TableHeader className="bg-gray-100">
                          <TableRow className="border-gray-300">
                            <TableHead className="text-gray-900">ID</TableHead>
                            <TableHead className="text-gray-900">Nom</TableHead>
                            <TableHead className="text-gray-900">Libellé</TableHead>
                            <TableHead className="text-gray-900">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getModuleRoles(module.id).map((role) => (
                            <TableRow 
                              key={role.id} 
                              className="border-gray-200 transition-all duration-300 hover:bg-black hover:text-white hover:scale-101 cursor-pointer"
                            >
                              <TableCell>{role.id}</TableCell>
                              <TableCell>{role.name}</TableCell>
                              <TableCell>{role.label}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditDialog(role)}
                                    className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                  >
                                    <Pencil size={16} />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => openDeleteConfirm(role.id)}
                                    className="bg-red-500 hover:bg-red-600 transition-colors duration-200"
                                  >
                                    <Trash size={16} />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                          {getModuleRoles(module.id).length === 0 && (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                                Aucun rôle trouvé pour ce module
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
              {modules.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  Aucun module trouvé. Créez d'abord des modules avant d'ajouter des rôles.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="view" className="mt-4">
          <Card className="border-gray-200 shadow-md">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <CardTitle className="text-gray-900">Consultation des rôles par module</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {modules.map((module) => (
                <Collapsible 
                  key={module.id} 
                  className="mb-4"
                  open={expandedModuleId === module.id}
                >
                  <div className="flex items-center border border-gray-200 p-3 rounded-md bg-gray-50">
                    <CollapsibleTrigger className="flex items-center w-full" onClick={() => toggleModuleExpand(module.id)}>
                      {expandedModuleId === module.id ? (
                        <ChevronDown size={16} className="mr-2 text-gray-700" />
                      ) : (
                        <ChevronRight size={16} className="mr-2 text-gray-700" />
                      )}
                      <div >
                        <span className="text-gray-600">ID:{module.id}--</span>
                        <span className="font-medium text-gray-900">Module: {module.name}</span>
                      </div>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <div className="ml-6 mt-2 border border-gray-200 rounded-md p-3 shadow-sm">
                      <Table>
                        <TableHeader className="bg-gray-100">
                          <TableRow className="border-gray-300">
                            <TableHead className="text-gray-900">ID</TableHead>
                            <TableHead className="text-gray-900">Nom</TableHead>
                            <TableHead className="text-gray-900">Libellé</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getModuleRoles(module.id).map((role) => (
                            <TableRow 
                              key={role.id} 
                              className="border-gray-200 transition-all duration-300 hover:bg-black hover:text-white hover:scale-101 cursor-pointer"
                            >
                              <TableCell>{role.id}</TableCell>
                              <TableCell>{role.name}</TableCell>
                              <TableCell>{role.label}</TableCell>
                            </TableRow>
                          ))}
                          {getModuleRoles(module.id).length === 0 && (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                                Aucun rôle trouvé pour ce module
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
              {modules.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  Aucun module trouvé.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md border-gray-300 shadow-lg">
          <DialogHeader className="bg-gray-50 -m-4 p-4 rounded-t-lg">
            <DialogTitle className="text-gray-900">Modifier le rôle</DialogTitle>
            <DialogDescription>
              Modifiez les informations du rôle sélectionné.
            </DialogDescription>
          </DialogHeader>
          {editingRole && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editModuleSelect" className="text-gray-700">Module</Label>
                <Select
                  onValueChange={(value) => setEditingRole({ ...editingRole, moduleId: Number(value) })}
                  value={String(editingRole.moduleId)}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Sélectionner un module" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((module) => (
                      <SelectItem key={module.id} value={String(module.id)}>
                        {module.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editRoleName" className="text-gray-700">Nom du rôle</Label>
                <Input
                  id="editRoleName"
                  value={editingRole.name}
                  onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editRoleLabel" className="text-gray-700">Libellé du rôle</Label>
                <Input
                  id="editRoleLabel"
                  value={editingRole.label}
                  onChange={(e) => setEditingRole({ ...editingRole, label: e.target.value })}
                  className="border-gray-300"
                />
              </div>
            </div>
          )}
          <DialogFooter className="bg-gray-50 -m-4 mt-0 p-4 rounded-b-lg">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-gray-400 text-gray-700">
              Annuler
            </Button>
            <Button onClick={handleUpdateRoleConfirm} className="bg-black hover:bg-gray-800">
              Continuer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* AlertDialog de confirmation d'ajout */}
      <AlertDialog open={isAddConfirmOpen} onOpenChange={setIsAddConfirmOpen}>
        <AlertDialogContent className="border-gray-300">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Confirmer l'ajout</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment ajouter le rôle <span className="font-medium text-gray-700">{newRole.name}</span> ({newRole.label}) 
              au module <span className="font-medium text-gray-700">
                {modules.find(m => m.id === newRole.moduleId)?.name || ""}
              </span> ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-400 text-gray-700">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddRole} className="bg-green-600 hover:bg-green-700">
              <Check size={16} className="mr-2" />
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* AlertDialog de confirmation de modification */}
      <AlertDialog open={isEditConfirmOpen} onOpenChange={setIsEditConfirmOpen}>
        <AlertDialogContent className="border-gray-300">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Confirmer la modification</AlertDialogTitle>
            <AlertDialogDescription>
              {editingRole && (
                <>
                  Voulez-vous vraiment modifier le rôle <span className="font-medium text-gray-700">{editingRole.name}</span> ({editingRole.label}) 
                  du module <span className="font-medium text-gray-700">
                    {modules.find(m => m.id === editingRole.moduleId)?.name || ""}
                  </span> ?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-400 text-gray-700">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateRole} className="bg-green-600 hover:bg-green-700">
              <Save size={16} className="mr-2" />
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* AlertDialog de confirmation de suppression */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent className="border-red-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-700">Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              {roleToDelete !== null && (
                <>
                  Êtes-vous sûr de vouloir supprimer le rôle <span className="font-medium text-red-600">
                    {roles.find(r => r.id === roleToDelete)?.name || ""}
                  </span> ?
                  <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-md text-red-700 text-sm">
                    Cette action est irréversible. Toutes les autorisations liées à ce rôle seront également supprimées.
                  </div>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-red-300 text-red-700">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRole} className="bg-red-600 hover:bg-red-700">
              <Trash size={16} className="mr-2" />
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RolesPage;