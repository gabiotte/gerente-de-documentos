import { FileText, CheckSquare, Clock, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/shared/Card';

const stats = [
  {
    label: 'Documentos Totais',
    value: '1,234',
    icon: FileText,
    color: 'bg-blue-500',
    trend: '+12%',
  },
  {
    label: 'Pendentes de Aprovação',
    value: '48',
    icon: Clock,
    color: 'bg-yellow-500',
    trend: '+5%',
  },
  {
    label: 'Aprovados Hoje',
    value: '23',
    icon: CheckSquare,
    color: 'bg-green-500',
    trend: '+18%',
  },
  {
    label: 'Funcionários Ativos',
    value: '567',
    icon: Users,
    color: 'bg-purple-500',
    trend: '+3%',
  },
];

const recentActivities = [
  {
    id: 1,
    action: 'Documento aprovado',
    document: 'Contrato de Trabalho - João Silva',
    time: 'Há 5 minutos',
    user: 'Maria Santos (RH)',
  },
  {
    id: 2,
    action: 'Novo documento enviado',
    document: 'Comprovante de Residência - Ana Costa',
    time: 'Há 15 minutos',
    user: 'Ana Costa',
  },
  {
    id: 3,
    action: 'Assinatura realizada',
    document: 'Termo de Confidencialidade - Pedro Oliveira',
    time: 'Há 1 hora',
    user: 'Pedro Oliveira',
  },
  {
    id: 4,
    action: 'Documento rejeitado',
    document: 'Certidão de Nascimento - Carlos Lima',
    time: 'Há 2 horas',
    user: 'José Ferreira (RH)',
  },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Visão geral do sistema de documentos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.trend}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600 mt-1">{activity.document}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-500">{activity.time}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{activity.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentos por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Aprovados</span>
                  <span className="text-sm font-medium text-gray-900">68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Pendentes</span>
                  <span className="text-sm font-medium text-gray-900">22%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '22%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Rejeitados</span>
                  <span className="text-sm font-medium text-gray-900">10%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
