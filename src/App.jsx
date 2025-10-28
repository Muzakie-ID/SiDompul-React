import React, { useState } from 'react';
import { Loader2, Smartphone, Calendar, Package, Wifi, AlertCircle, CheckCircle } from 'lucide-react';

function App() {
  const [msisdn, setMsisdn] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const getStatus = () => {
    if (!result) return '-';
    if (result.expDate?.toLowerCase().includes('expired') || result.expDate?.toLowerCase().includes('blm')) {
      return "Tidak Aktif / Expired";
    }
    return "Aktif";
  };


  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleCheck = async () => {
    if (!msisdn) {
      setError('Nomor telepon harus diisi');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/check-kuota', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: msisdn
        })
      });

      const data = await response.json();

      if (data.statusCode === 200 && data.result.errorCode === '00') {
        setResult(data.result.data);
      } else {
        setError(data.result.errorMessage || 'Gagal mengambil data');
      }
    } catch (err) {
      setError(`Terjadi kesalahan koneksi: ${err.message}. Pastikan API dapat diakses.`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Cek Kuota XL</h1>
          <p className="text-gray-600">Masukkan nomor telepon untuk mengecek sisa kuota</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Contoh: 081xxxxxxxx"
                  value={msisdn}
                  onChange={(e) => setMsisdn(e.target.value.replace(/[^0-9]/g, ''))}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                  disabled={loading}
                />
              </div>
            </div>
            <button
              onClick={handleCheck}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Mengecek...</span>
                </>
              ) : (
                <span>Cek Kuota</span>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Gagal</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h2 className="text-2xl font-bold text-gray-800">Informasi Nomor</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Nomor</p>
                  <p className="text-lg font-semibold text-gray-800">{result.msisdn}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Provider</p>
                  <p className="text-lg font-semibold text-gray-800">{result.owner}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Kategori</p>
                  <p className="text-lg font-semibold text-gray-800">{result.category}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Status Jaringan</p>
                  <p className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Wifi className="w-5 h-5" />
                    {result.status4G}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Tenure</p>
                  <p className="text-lg font-semibold text-gray-800">{result.tenure}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Masa Aktif</p>

                  {getStatus() === "Aktif" ? (
                    <p className="text-lg font-semibold flex items-center gap-2 text-green-600">
                      <Calendar className="w-5 h-5" />
                      {formatDate(result.expDate)}
                    </p>
                  ) : (
                    <p className="text-lg font-semibold flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      Tidak Aktif / Expired
                    </p>
                  )}
                </div>
              </div>
            </div>

            {result.packages?.packageInfo && Array.isArray(result.packages.packageInfo) && result.packages.packageInfo.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-6 h-6 text-blue-500" />
                  <h2 className="text-2xl font-bold text-gray-800">Paket Kuota</h2>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Terakhir update: {result.packages.lastUpdate}
                </p>

                <div className="space-y-6">
                  {result.packages.packageInfo.map((packageGroup, groupIdx) => (
                    packageGroup.map((pkg, pkgIdx) => (
                      <div key={`${groupIdx}-${pkgIdx}`} className="border-2 border-gray-200 rounded-xl p-5">
                        <div className="flex justify-between items-start mb-4 pb-4 border-b-2 border-gray-100">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                              {pkg.packages.name}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Berlaku s/d {formatDate(pkg.packages.expDate)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {pkg.benefits.map((benefit, benefitIdx) => {
                            const quotaNum = parseFloat(benefit.quota);
                            const remainingNum = parseFloat(benefit.remaining);
                            const percentage = quotaNum > 0 ? (remainingNum / quotaNum) * 100 : 0;
                            
                            return (
                              <div key={benefitIdx} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                  <p className="font-semibold text-gray-800">{benefit.bname}</p>
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    {benefit.type}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-sm mb-2">
                                  <span className="text-gray-600">Sisa: {benefit.remaining}</span>
                                  <span className="text-gray-600">Total: {benefit.quota}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      percentage > 50 ? 'bg-green-500' : 
                                      percentage > 20 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-6 text-center text-gray-600">
                <AlertCircle className="w-8 h-8 mx-auto mb-3 text-gray-500" />
                <p className="text-lg font-semibold">Tidak ada paket aktif</p>
                <p className="text-sm text-gray-500">Nomor ini tidak memiliki kuota paket yang terdaftar.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <footer className="text-center text-gray-600 mt-12 pb-6 flex flex-col items-center">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} — Made with</span>
          <span className="text-red-500">❤️</span>
          <span>by <b>Gugun09 DevTeam</b></span>
        </div>
      </footer>
    </div>
  );
}

export default App;