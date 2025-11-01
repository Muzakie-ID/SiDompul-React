import React, { useState } from 'react';
import { Loader2, Smartphone, Calendar, Package, Wifi, AlertCircle, CheckCircle, TrendingUp, Clock, Signal } from 'lucide-react';

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

  const QuotaCard = ({ benefit }) => {
    const quotaNum = parseFloat(benefit.quota);
    const remainingNum = parseFloat(benefit.remaining);
    const percentage = quotaNum > 0 ? (remainingNum / quotaNum) * 100 : 0;
    
    return (
      <div className="group relative bg-gradient-to-br from-white to-gray-50 p-5 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300"></div>
        
        <div className="relative">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-lg mb-1">{benefit.bname}</h4>
              <span className="text-xs font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full shadow-md">
                {benefit.type}
              </span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {percentage.toFixed(0)}%
              </div>
              <p className="text-xs text-gray-500">tersisa</p>
            </div>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Sisa
              </span>
              <span className="font-bold text-gray-800">{benefit.remaining}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total</span>
              <span className="font-semibold text-gray-600">{benefit.quota}</span>
            </div>
          </div>

          <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                percentage > 50 ? 'bg-gradient-to-r from-green-400 to-green-600' : 
                percentage > 20 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 
                'bg-gradient-to-r from-red-400 to-red-600'
              }`}
              style={{ width: `${percentage}%` }}
            >
              <div className="w-full h-full bg-white/30 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-block mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full">
                <Signal className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-3">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Cek Kuota XL
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Pantau sisa kuota internet Anda secara real-time dengan mudah dan cepat
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                  Nomor Telepon
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
                  <Smartphone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <input
                    type="text"
                    placeholder="081234567890"
                    value={msisdn}
                    onChange={(e) => setMsisdn(e.target.value.replace(/[^0-9]/g, ''))}
                    onKeyPress={handleKeyPress}
                    className="relative w-full pl-14 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none text-lg font-medium bg-white transition-all"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="sm:self-end">
                <button
                  onClick={handleCheck}
                  disabled={loading}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transform"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <Signal className="w-6 h-6" />
                      <span>Cek Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8 animate-in fade-in slide-in-from-top duration-300">
            <div className="bg-red-50/80 backdrop-blur-sm border-2 border-red-200 p-5 rounded-2xl flex items-start gap-4 shadow-lg">
              <div className="bg-red-100 p-2 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-800 text-lg mb-1">Terjadi Kesalahan</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Number Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Nomor Telepon</p>
                    <p className="text-xl font-bold text-gray-800">{result.msisdn}</p>
                  </div>
                </div>
              </div>

              {/* Provider Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                    <Signal className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Provider</p>
                    <p className="text-xl font-bold text-gray-800">{result.owner}</p>
                  </div>
                </div>
              </div>

              {/* Category Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 rounded-2xl shadow-lg">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Kategori</p>
                    <p className="text-xl font-bold text-gray-800">{result.category}</p>
                  </div>
                </div>
              </div>

              {/* Network Status Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg">
                    <Wifi className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Status Jaringan</p>
                    <p className="text-xl font-bold text-gray-800">{result.status4G}</p>
                  </div>
                </div>
              </div>

              {/* Tenure Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Umur Kartu</p>
                    <p className="text-xl font-bold text-gray-800">{result.tenure}</p>
                  </div>
                </div>
              </div>

              {/* Expiry Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl shadow-lg ${
                    getStatus() === "Aktif" 
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' 
                      : 'bg-gradient-to-br from-red-500 to-red-600'
                  }`}>
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Masa Aktif</p>
                    {getStatus() === "Aktif" ? (
                      <p className="text-xl font-bold text-emerald-600">
                        {formatDate(result.spExpDate)}
                      </p>
                    ) : (
                      <p className="text-xl font-bold text-red-600">Expired</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quota Packages Section */}
            {result.packages?.packageInfo && Array.isArray(result.packages.packageInfo) && result.packages.packageInfo.length > 0 ? (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-4 rounded-2xl shadow-lg">
                      <Package className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Paket Kuota Aktif
                      </h2>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Update: {result.packages.lastUpdate}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {result.packages.packageInfo.map((packageGroup, groupIdx) => (
                    packageGroup.map((pkg, pkgIdx) => (
                      <div key={`${groupIdx}-${pkgIdx}`} className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 pb-6 border-b-2 border-gray-200">
                          <div className="flex-1 mb-4 sm:mb-0">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                              {pkg.packages.name}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-5 h-5" />
                              <span className="font-medium">Berlaku hingga {formatDate(pkg.packages.expDate)}</span>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg">
                            {pkg.benefits.length} Benefit
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {pkg.benefits.map((benefit, benefitIdx) => (
                            <QuotaCard key={benefitIdx} benefit={benefit} />
                          ))}
                        </div>
                      </div>
                    ))
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center border border-white/20">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Tidak Ada Paket Aktif</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Nomor ini belum memiliki paket kuota yang terdaftar atau sedang tidak aktif.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative text-center py-8 mt-16">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-gray-600">
            <span>© {new Date().getFullYear()} —</span>
            <span>Crafted with</span>
            <span className="text-red-500 animate-pulse text-xl">❤️</span>
            <span>by</span>
          </div>
          <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gugun09 DevTeam
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;