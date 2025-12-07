import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Vineyard {
  id: number;
  name: string;
  location: string;
  bushCount: number;
  type: 'открытый грунт' | 'теплица';
  x: number;
  y: number;
  latitude: number;
  longitude: number;
  cat: number;
  technicalVarieties: number;
  tableVarieties: number;
}

const API_URL = 'https://functions.poehali.dev/acf3dfe9-a52f-4a00-a3fe-22c5d012c3dc';

const Index = () => {
  const { toast } = useToast();
  const [vineyards, setVineyards] = useState<Vineyard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedVineyard, setSelectedVineyard] = useState<Vineyard | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newVineyard, setNewVineyard] = useState({
    name: '',
    location: '',
    bushCount: 0,
    type: 'открытый грунт' as 'открытый грунт' | 'теплица',
    latitude: 0,
    longitude: 0,
    cat: 0,
    technicalVarieties: 0,
    tableVarieties: 0
  });

  useEffect(() => {
    fetchVineyards();
  }, []);

  const fetchVineyards = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setVineyards(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingNew) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const vineyardData = {
      ...newVineyard,
      x,
      y
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vineyardData)
      });
      
      if (response.ok) {
        await fetchVineyards();
        toast({
          title: 'Успех',
          description: 'Виноградарь добавлен'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить виноградаря',
        variant: 'destructive'
      });
    }

    setIsAddingNew(false);
    setNewVineyard({ name: '', location: '', bushCount: 0, type: 'открытый грунт', latitude: 0, longitude: 0, cat: 0, technicalVarieties: 0, tableVarieties: 0 });
  };

  const totalBushes = vineyards.reduce((sum, v) => sum + v.bushCount, 0);
  const openGroundCount = vineyards.filter(v => v.type === 'открытый грунт').length;
  const greenhouseCount = vineyards.filter(v => v.type === 'теплица').length;
  const totalTechnicalVarieties = vineyards.reduce((sum, v) => sum + v.technicalVarieties, 0);
  const totalTableVarieties = vineyards.reduce((sum, v) => sum + v.tableVarieties, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Загрузка данных...</p>
        </div>
      </div>
    );
  }

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
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Icon name="Grape" className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Технических сортов</p>
                  <p className="text-2xl font-bold">{totalTechnicalVarieties}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-pink-100 rounded-lg">
                  <Icon name="Apple" className="text-pink-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Столовых сортов</p>
                  <p className="text-2xl font-bold">{totalTableVarieties}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="animate-scale-in" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle className="text-lg">Распределение сортов</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Технические', value: totalTechnicalVarieties, color: '#a855f7' },
                      { name: 'Столовые', value: totalTableVarieties, color: '#ec4899' }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Технические', value: totalTechnicalVarieties, color: '#a855f7' },
                      { name: 'Столовые', value: totalTableVarieties, color: '#ec4899' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle className="text-lg">Сорта по виноградарям</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={vineyards.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="technicalVarieties" fill="#a855f7" name="Технические" />
                  <Bar dataKey="tableVarieties" fill="#ec4899" name="Столовые" />
                </BarChart>
              </ResponsiveContainer>
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
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="latitude">Широта</Label>
                          <Input
                            id="latitude"
                            type="number"
                            step="0.0001"
                            value={newVineyard.latitude}
                            onChange={(e) => setNewVineyard({ ...newVineyard, latitude: parseFloat(e.target.value) || 0 })}
                            placeholder="53.1950"
                          />
                        </div>
                        <div>
                          <Label htmlFor="longitude">Долгота</Label>
                          <Input
                            id="longitude"
                            type="number"
                            step="0.0001"
                            value={newVineyard.longitude}
                            onChange={(e) => setNewVineyard({ ...newVineyard, longitude: parseFloat(e.target.value) || 0 })}
                            placeholder="50.1002"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cat">САТ (сумма активных температур, °C)</Label>
                        <Input
                          id="cat"
                          type="number"
                          value={newVineyard.cat}
                          onChange={(e) => setNewVineyard({ ...newVineyard, cat: parseInt(e.target.value) || 0 })}
                          placeholder="2450"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="technicalVarieties">Технических сортов</Label>
                          <Input
                            id="technicalVarieties"
                            type="number"
                            value={newVineyard.technicalVarieties}
                            onChange={(e) => setNewVineyard({ ...newVineyard, technicalVarieties: parseInt(e.target.value) || 0 })}
                            placeholder="3"
                          />
                        </div>
                        <div>
                          <Label htmlFor="tableVarieties">Столовых сортов</Label>
                          <Input
                            id="tableVarieties"
                            type="number"
                            value={newVineyard.tableVarieties}
                            onChange={(e) => setNewVineyard({ ...newVineyard, tableVarieties: parseInt(e.target.value) || 0 })}
                            placeholder="5"
                          />
                        </div>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Широта</p>
                      <p className="font-semibold">{selectedVineyard.latitude.toFixed(4)}°</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Долгота</p>
                      <p className="font-semibold">{selectedVineyard.longitude.toFixed(4)}°</p>
                    </div>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <p className="text-sm text-muted-foreground mb-1">Сумма активных температур (САТ)</p>
                    <div className="flex items-baseline gap-2">
                      <p className="font-bold text-2xl text-amber-600">{selectedVineyard.cat}</p>
                      <span className="text-sm text-muted-foreground">°C</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <p className="text-xs text-muted-foreground mb-1">Технических сортов</p>
                      <p className="font-bold text-xl text-purple-600">{selectedVineyard.technicalVarieties}</p>
                    </div>
                    <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                      <p className="text-xs text-muted-foreground mb-1">Столовых сортов</p>
                      <p className="font-bold text-xl text-pink-600">{selectedVineyard.tableVarieties}</p>
                    </div>
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