import React, { useState } from 'react';
import { ShoppingCart, DollarSign, Package, TrendingUp, Users } from 'lucide-react';
import { COSTOS_TURNOS } from '../types/game';

const TurnoBadge: React.FC<{ costo: number }> = ({ costo }) => (
  <span className="bg-amber-200 text-amber-800 text-xs font-bold px-1.5 py-0.5 rounded ml-1">{costo}T</span>
);

const Trade: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('market');

  const marketOffers = [
    {
      id: 1,
      seller: 'Imperio del Norte',
      resource: 'Madera',
      quantity: 5000,
      pricePerUnit: 2.5,
      totalPrice: 12500,
      expires: '2h 30m'
    },
    {
      id: 2,
      seller: 'Reino Élfico',
      resource: 'Hierro',
      quantity: 2000,
      pricePerUnit: 4.2,
      totalPrice: 8400,
      expires: '5h 15m'
    },
    {
      id: 3,
      seller: 'Clan Orco',
      resource: 'Piedra',
      quantity: 3500,
      pricePerUnit: 1.8,
      totalPrice: 6300,
      expires: '1h 45m'
    },
    {
      id: 4,
      seller: 'Fortaleza Enana',
      resource: 'Comida',
      quantity: 8000,
      pricePerUnit: 1.2,
      totalPrice: 9600,
      expires: '3h 20m'
    }
  ];

  const myOffers = [
    {
      id: 1,
      resource: 'Oro',
      quantity: 1000,
      pricePerUnit: 1.0,
      totalPrice: 1000,
      buyers: 3,
      expires: '4h 25m'
    },
    {
      id: 2,
      resource: 'Gemas',
      quantity: 500,
      pricePerUnit: 8.5,
      totalPrice: 4250,
      buyers: 1,
      expires: '6h 10m'
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      type: 'buy',
      resource: 'Hierro',
      quantity: 1500,
      price: 6300,
      partner: 'Reino de Acero',
      time: 'hace 2h'
    },
    {
      id: 2,
      type: 'sell',
      resource: 'Madera',
      quantity: 3000,
      price: 7200,
      partner: 'Imperio Verde',
      time: 'hace 4h'
    },
    {
      id: 3,
      type: 'buy',
      resource: 'Comida',
      quantity: 5000,
      price: 5500,
      partner: 'Granjas del Valle',
      time: 'hace 1d'
    }
  ];

  const resourceIcons: { [key: string]: string } = {
    'Madera': '🪵',
    'Hierro': '⚔️',
    'Piedra': '🪨',
    'Comida': '🌾',
    'Oro': '💰',
    'Gemas': '💎'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
        <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
          <ShoppingCart className="text-yellow-600" />
          Centro de Comercio
        </h1>
        <p className="text-amber-700 mt-2">Comercia recursos con otros imperios</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
        <div className="flex flex-wrap gap-4 justify-center">
          {[
            { id: 'market', name: 'Mercado', icon: ShoppingCart },
            { id: 'myoffers', name: 'Mis Ofertas', icon: Package },
            { id: 'history', name: 'Historial', icon: TrendingUp }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-semibold ${
                  selectedTab === tab.id
                    ? 'bg-yellow-600 text-white shadow-lg'
                    : 'bg-amber-50 text-amber-800 hover:bg-yellow-100 border border-yellow-400'
                }`}
              >
                <Icon size={20} />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Market Tab */}
      {selectedTab === 'market' && (
        <div className="space-y-6">
          {/* Quick Create Offer */}
          <div className="bg-gradient-to-b from-green-100 to-green-200 p-6 rounded-lg border-2 border-green-500">
            <h3 className="text-xl font-bold text-green-800 mb-4">Crear Nueva Oferta</h3>
            <p className="text-amber-600 text-xs mb-2">{'\u26A0\uFE0F'} El Maná y el Karma no son comerciables</p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <select className="p-3 border border-green-400 rounded bg-white" aria-label="Recurso a ofertar">
                <option>Recurso</option>
                <option>Madera</option>
                <option>Hierro</option>
                <option>Piedra</option>
                <option>Comida</option>
                <option>Oro</option>
                <option>Gemas</option>
              </select>
              <input type="number" placeholder="Cantidad" className="p-3 border border-green-400 rounded" />
              <input type="number" placeholder="Precio por unidad" className="p-3 border border-green-400 rounded" />
              <select className="p-3 border border-green-400 rounded bg-white">
                <option>24 horas</option>
                <option>12 horas</option>
                <option>6 horas</option>
                <option>3 horas</option>
              </select>
              <button type="button" className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold inline-flex items-center justify-center flex-wrap gap-1">
                Publicar <TurnoBadge costo={COSTOS_TURNOS.comerciarOro} />
              </button>
            </div>
          </div>

          {/* Market Offers */}
          <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
            <h3 className="text-xl font-bold text-amber-800 mb-4">Ofertas del Mercado</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-yellow-600">
                    <th className="text-left text-amber-800 p-3">Vendedor</th>
                    <th className="text-center text-amber-800 p-3">Recurso</th>
                    <th className="text-center text-amber-800 p-3">Cantidad</th>
                    <th className="text-center text-amber-800 p-3">Precio/u</th>
                    <th className="text-center text-amber-800 p-3">Total</th>
                    <th className="text-center text-amber-800 p-3">Expira</th>
                    <th className="text-center text-amber-800 p-3">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {marketOffers.map(offer => (
                    <tr key={offer.id} className="border-b border-yellow-400 hover:bg-yellow-100">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                            <Users className="text-white" size={16} />
                          </div>
                          <span className="text-amber-800 font-semibold">{offer.seller}</span>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-2xl">{resourceIcons[offer.resource]}</span>
                          <span className="text-amber-800 font-semibold">{offer.resource}</span>
                        </div>
                      </td>
                      <td className="text-center p-3 text-amber-800 font-bold">
                        {offer.quantity.toLocaleString()}
                      </td>
                      <td className="text-center p-3 text-amber-800">
                        {offer.pricePerUnit} 💰
                      </td>
                      <td className="text-center p-3 text-amber-800 font-bold">
                        {offer.totalPrice.toLocaleString()} 💰
                      </td>
                      <td className="text-center p-3 text-amber-600">
                        {offer.expires}
                      </td>
                      <td className="text-center p-3">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                          Comprar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* My Offers Tab */}
      {selectedTab === 'myoffers' && (
        <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
          <h3 className="text-xl font-bold text-amber-800 mb-4">Mis Ofertas Activas</h3>
          {myOffers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-yellow-600">
                    <th className="text-center text-amber-800 p-3">Recurso</th>
                    <th className="text-center text-amber-800 p-3">Cantidad</th>
                    <th className="text-center text-amber-800 p-3">Precio/u</th>
                    <th className="text-center text-amber-800 p-3">Total</th>
                    <th className="text-center text-amber-800 p-3">Interesados</th>
                    <th className="text-center text-amber-800 p-3">Expira</th>
                    <th className="text-center text-amber-800 p-3">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {myOffers.map(offer => (
                    <tr key={offer.id} className="border-b border-yellow-400 hover:bg-yellow-100">
                      <td className="text-center p-3">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-2xl">{resourceIcons[offer.resource]}</span>
                          <span className="text-amber-800 font-semibold">{offer.resource}</span>
                        </div>
                      </td>
                      <td className="text-center p-3 text-amber-800 font-bold">
                        {offer.quantity.toLocaleString()}
                      </td>
                      <td className="text-center p-3 text-amber-800">
                        {offer.pricePerUnit} 💰
                      </td>
                      <td className="text-center p-3 text-amber-800 font-bold">
                        {offer.totalPrice.toLocaleString()} 💰
                      </td>
                      <td className="text-center p-3">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                          {offer.buyers} interesados
                        </span>
                      </td>
                      <td className="text-center p-3 text-amber-600">
                        {offer.expires}
                      </td>
                      <td className="text-center p-3">
                        <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors mr-2">
                          Cancelar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="mx-auto text-amber-400 mb-4" size={64} />
              <h4 className="text-lg font-semibold text-amber-800 mb-2">No tienes ofertas activas</h4>
              <p className="text-amber-600">Crea tu primera oferta en el mercado para comenzar a comerciar</p>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {selectedTab === 'history' && (
        <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
          <h3 className="text-xl font-bold text-amber-800 mb-4">Historial de Transacciones</h3>
          <div className="space-y-3">
            {recentTransactions.map(transaction => (
              <div key={transaction.id} className="bg-amber-50 p-4 rounded-lg border border-yellow-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'buy' ? 'bg-blue-500' : 'bg-green-500'
                    }`}>
                      {transaction.type === 'buy' ? 
                        <ShoppingCart className="text-white" size={20} /> :
                        <DollarSign className="text-white" size={20} />
                      }
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${
                          transaction.type === 'buy' ? 'text-blue-800' : 'text-green-800'
                        }`}>
                          {transaction.type === 'buy' ? 'COMPRA' : 'VENTA'}
                        </span>
                        <span className="text-2xl">{resourceIcons[transaction.resource]}</span>
                        <span className="text-amber-800 font-semibold">
                          {transaction.resource} x{transaction.quantity.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-amber-600 text-sm">
                        Con {transaction.partner} • {transaction.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      transaction.type === 'buy' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.type === 'buy' ? '-' : '+'}
                      {transaction.price.toLocaleString()} 💰
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trade Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-b from-green-100 to-green-200 p-6 rounded-lg border-2 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-green-800">Ganancias del Mes</h3>
              <p className="text-2xl font-bold text-green-700">+45,680 💰</p>
            </div>
            <TrendingUp className="text-green-600" size={48} />
          </div>
        </div>

        <div className="bg-gradient-to-b from-blue-100 to-blue-200 p-6 rounded-lg border-2 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-blue-800">Transacciones</h3>
              <p className="text-2xl font-bold text-blue-700">127</p>
            </div>
            <Package className="text-blue-600" size={48} />
          </div>
        </div>

        <div className="bg-gradient-to-b from-purple-100 to-purple-200 p-6 rounded-lg border-2 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-purple-800">Socios Comerciales</h3>
              <p className="text-2xl font-bold text-purple-700">23</p>
            </div>
            <Users className="text-purple-600" size={48} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trade;