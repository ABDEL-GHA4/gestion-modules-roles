import React, { useState } from "react";
import { useData } from "../../contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash, Plus, Save, Check } from "lucide-react";
import ExportButton from "../../components/ExportButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ModulesPage: React.FC = () => {
  const { modules, addModule, updateModule, deleteModule } = useData();
  
  // États pour les dialogues principaux
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // États pour les dialogues de confirmation
  const [isAddConfirmOpen, setIsAddConfirmOpen] = useState(false);
  const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  const [newModule, setNewModule] = useState({ name: "", description: "" });
  const [editingModule, setEditingModule] = useState<{ id: number; name: string; description: string } | null>(null);
  const [moduleToDelete, setModuleToDelete] = useState<number | null>(null);
  
  const handleAddModuleConfirm = () => {
    if (newModule.name.trim() === "") {
      toast.error("Le nom du module est requis");
      return;
    }
    
    // Ouvrir le dialogue de confirmation au lieu d'ajouter directement
    setIsAddConfirmOpen(true);
  };
  
  const handleAddModule = () => {
    addModule(newModule);
    setNewModule({ name: "", description: "" });
    setIsAddConfirmOpen(false);
    setIsAddDialogOpen(false);
    toast.success("Module ajouté avec succès");
  };
  
  const handleUpdateModuleConfirm = () => {
    if (!editingModule) return;
    
    if (editingModule.name.trim() === "") {
      toast.error("Le nom du module est requis");
      return;
    }
    
    // Ouvrir le dialogue de confirmation au lieu de mettre à jour directement
    setIsEditConfirmOpen(true);
  };
  
  const handleUpdateModule = () => {
    if (!editingModule) return;
    
    updateModule(editingModule.id, {
      name: editingModule.name,
      description: editingModule.description
    });
    
    setEditingModule(null);
    setIsEditConfirmOpen(false);
    setIsEditDialogOpen(false);
    toast.success("Module mis à jour avec succès");
  };
  
  const openDeleteConfirm = (moduleId) => {
    setModuleToDelete(moduleId);
    setIsDeleteConfirmOpen(true);
  };
  
  const handleDeleteModule = () => {
    if (moduleToDelete === null) return;
    
    deleteModule(moduleToDelete);
    setModuleToDelete(null);
    setIsDeleteConfirmOpen(false);
    toast.success("Module supprimé avec succès");
  };
  
  const openEditDialog = (module) => {
    setEditingModule(module);
    setIsEditDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestion des Modules</h2>
        <ExportButton data={modules} filename="modules" />
      </div>
      
      <Tabs defaultValue="edit">
        <TabsList className="bg-gray-50 border border-gray-200">
          <TabsTrigger value="edit" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Mise à jour des modules
          </TabsTrigger>
          <TabsTrigger value="view" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Consultation des modules
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="mt-4 space-y-6">
          <Card className="border-gray-200 shadow-md">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <CardTitle className="text-gray-900 flex justify-between items-center">
                <span>Liste des modules</span>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-black hover:bg-gray-800 flex items-center gap-2">
                      <Plus size={16} />
                      <span>Ajouter un module</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md border-gray-300 shadow-lg">
                    <DialogHeader className="bg-gray-50 -m-4 p-4 rounded-t-lg">
                      <DialogTitle className="text-gray-900">Ajouter un nouveau module</DialogTitle>
                      <DialogDescription>
                        Complétez les informations ci-dessous pour créer un nouveau module.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="moduleName" className="text-gray-700">Nom du module</Label>
                        <Input
                          id="moduleName"
                          value={newModule.name}
                          onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
                          placeholder="Ex: Gestion des utilisateurs"
                          className="border-gray-300"
                        />
                      </div>
                      
                    </div>
                    <DialogFooter className="bg-gray-50 -m-4 mt-0 p-4 rounded-b-lg">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-gray-400 text-gray-700">
                        Annuler
                      </Button>
                      <Button onClick={handleAddModuleConfirm} className="bg-black hover:bg-gray-800">
                        Continuer
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow className="border-gray-300">
                    <TableHead className="text-gray-900">ID</TableHead>
                    <TableHead className="text-gray-900">Nom</TableHead>
                    <TableHead className="text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((module) => (
                    <TableRow 
                      key={module.id}
                      className="border-gray-200 transition-all duration-300 hover:bg-black hover:text-white hover:scale-101 cursor-pointer"
                    >
                      <TableCell>{module.id}</TableCell>
                      <TableCell>{module.name}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(module)}
                            className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteConfirm(module.id)}
                            className="bg-red-500 hover:bg-red-600 transition-colors duration-200"
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {modules.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                        Aucun module trouvé.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="view" className="mt-4">
          <Card className="border-gray-200 shadow-md">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <CardTitle className="text-gray-900">Consultation des modules</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow className="border-gray-300">
                    <TableHead className="text-gray-900">ID</TableHead>
                    <TableHead className="text-gray-900">Nom du module</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((module) => (
                    <TableRow 
                      key={module.id}
                      className="border-gray-200 transition-all duration-300 hover:bg-black hover:text-white hover:scale-101 cursor-pointer"
                    >
                      <TableCell>{module.id}</TableCell>
                      <TableCell>{module.name}</TableCell>
                    </TableRow>
                  ))}
                  {modules.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-4 text-gray-500">
                        Aucun module trouvé.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md border-gray-300 shadow-lg">
          <DialogHeader className="bg-gray-50 -m-4 p-4 rounded-t-lg">
            <DialogTitle className="text-gray-900">Modifier le module</DialogTitle>
            <DialogDescription>
              Modifiez les informations du module sélectionné.
            </DialogDescription>
          </DialogHeader>
          {editingModule && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editModuleName" className="text-gray-700">Nom du module</Label>
                <Input
                  id="editModuleName"
                  value={editingModule.name}
                  onChange={(e) => setEditingModule({ ...editingModule, name: e.target.value })}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editModuleDescription" className="text-gray-700">Description (optionnelle)</Label>
                <Input
                  id="editModuleDescription"
                  value={editingModule.description}
                  onChange={(e) => setEditingModule({ ...editingModule, description: e.target.value })}
                  className="border-gray-300"
                />
              </div>
            </div>
          )}
          <DialogFooter className="bg-gray-50 -m-4 mt-0 p-4 rounded-b-lg">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-gray-400 text-gray-700">
              Annuler
            </Button>
            <Button onClick={handleUpdateModuleConfirm} className="bg-black hover:bg-gray-800">
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
              Voulez-vous vraiment ajouter le module <span className="font-medium text-gray-700">{newModule.name}</span> ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-400 text-gray-700">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddModule} className="bg-green-600 hover:bg-green-700">
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
              {editingModule && (
                <>
                  Voulez-vous vraiment modifier le module <span className="font-medium text-gray-700">{editingModule.name}</span> ?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-400 text-gray-700">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateModule} className="bg-green-600 hover:bg-green-700">
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
              {moduleToDelete !== null && (
                <>
                  Êtes-vous sûr de vouloir supprimer le module <span className="font-medium text-red-600">
                    {modules.find(m => m.id === moduleToDelete)?.name || ""}
                  </span> ?
                  <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-md text-red-700 text-sm">
                    Cette action est irréversible. Tous les rôles associés à ce module seront également supprimés.
                  </div>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-red-300 text-red-700">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteModule} className="bg-red-600 hover:bg-red-700">
              <Trash size={16} className="mr-2" />
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ModulesPage;
