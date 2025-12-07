import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Vineyard {
  id: number;
  name: string;
  location: string;
  bushCount: number;
  type: 'открытый грунт' | 'теплица';
  x: number;
  y: number;
}

const Index = () => {
  const [vineyards, setVineyards] = useState<Vineyard[]>([
    { id: 1, name: 'Виноградник Иванова', location: 'Самара', bushCount: 25, type: 'открытый грунт', x: 45, y: 55 },
    { id: 2, name: 'Виноградник Петрова', location: 'Тольятти', bushCount: 40, type: 'теплица', x: 35, y: 48 },
    { id: 3, name: 'Виноградник Сидорова', location: 'Сызрань', bushCount: 30, type: 'открытый грунт', x: 52, y: 62 }
  ]);

  const [selectedVineyard, setSelectedVineyard] = useState<Vineyard | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newVineyard, setNewVineyard] = useState({
    name: '',
    location: '',
    bushCount: 0,
    type: 'открытый грунт' as 'открытый грунт' | 'теплица'
  });

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingNew) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const vineyard: Vineyard = {
      id: Date.now(),
      ...newVineyard,
      x,
      y
    };

    setVineyards([...vineyards, vineyard]);
    setIsAddingNew(false);
    setNewVineyard({ name: '', location: '', bushCount: 0, type: 'открытый грунт' });
  };

  const totalBushes = vineyards.reduce((sum, v) => sum + v.bushCount, 0);
  const openGroundCount = vineyards.filter(v => v.type === 'открытый грунт').length;
  const greenhouseCount = vineyards.filter(v => v.type === 'теплица').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <header className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            🍇 Ампелограф
          </h1>
          <p className="text-muted-foreground text-lg">
            Карта виноградарей Самарской области
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="animate-scale-in">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon name="Users" className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Виноградарей</p>
                  <p className="text-2xl font-bold">{vineyards.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Icon name="Sprout" className="text-secondary" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Кустов</p>
                  <p className="text-2xl font-bold">{totalBushes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Icon name="Mountain" className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Открытый грунт</p>
                  <p className="text-2xl font-bold">{openGroundCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Icon name="Home" className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Теплицы</p>
                  <p className="text-2xl font-bold">{greenhouseCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Map" size={24} />
                  Карта Самарской области
                </CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => setIsAddingNew(true)}>
                      <Icon name="Plus" size={18} className="mr-2" />
                      Добавить метку
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Добавить виноградарь</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Название</Label>
                        <Input
                          id="name"
                          value={newVineyard.name}
                          onChange={(e) => setNewVineyard({ ...newVineyard, name: e.target.value })}
                          placeholder="Виноградник..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Населённый пункт</Label>
                        <Input
                          id="location"
                          value={newVineyard.location}
                          onChange={(e) => setNewVineyard({ ...newVineyard, location: e.target.value })}
                          placeholder="Самара, Тольятти..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="bushCount">Количество кустов</Label>
                        <Input
                          id="bushCount"
                          type="number"
                          value={newVineyard.bushCount}
                          onChange={(e) => setNewVineyard({ ...newVineyard, bushCount: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Тип выращивания</Label>
                        <Select
                          value={newVineyard.type}
                          onValueChange={(value: 'открытый грунт' | 'теплица') => 
                            setNewVineyard({ ...newVineyard, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="открытый грунт">Открытый грунт</SelectItem>
                            <SelectItem value="теплица">Теплица</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Заполните форму, затем кликните на карту чтобы поставить метку
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="relative w-full h-[500px] bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-dashed border-border overflow-hidden cursor-crosshair"
                onClick={handleMapClick}
              >
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                  <p className="text-sm font-semibold">Самарская область</p>
                </div>

                {vineyards.map((vineyard) => (
                  <button
                    key={vineyard.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group transition-transform hover:scale-110"
                    style={{ left: `${vineyard.x}%`, top: `${vineyard.y}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVineyard(vineyard);
                    }}
                  >
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                        vineyard.type === 'теплица' ? 'bg-blue-500' : 'bg-green-500'
                      }`}>
                        <Icon 
                          name={vineyard.type === 'теплица' ? 'Home' : 'Mountain'} 
                          size={20} 
                          className="text-white"
                        />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {vineyard.bushCount}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Список виноградарей</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
                {vineyards.map((vineyard) => (
                  <button
                    key={vineyard.id}
                    onClick={() => setSelectedVineyard(vineyard)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                      selectedVineyard?.id === vineyard.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">{vineyard.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          <Icon name="MapPin" size={12} className="inline mr-1" />
                          {vineyard.location}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant={vineyard.type === 'теплица' ? 'default' : 'secondary'} className="text-xs">
                            {vineyard.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {vineyard.bushCount} кустов
                          </span>
                        </div>
                      </div>
                      <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {selectedVineyard && (
              <Card className="border-primary animate-scale-in">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="Info" size={20} />
                    Детали
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Название</p>
                    <p className="font-semibold">{selectedVineyard.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Местоположение</p>
                    <p className="font-semibold">{selectedVineyard.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Количество кустов</p>
                    <p className="font-semibold text-2xl text-secondary">{selectedVineyard.bushCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Тип выращивания</p>
                    <Badge variant={selectedVineyard.type === 'теплица' ? 'default' : 'secondary'}>
                      {selectedVineyard.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
