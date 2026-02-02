import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { getRecoveryAdvice, getDefaultSocialContext } from '../config/activityConfig';
import { getLastBodyWeight, loadInstructors, saveInstructor, loadJiuJitsuPeers, saveJiuJitsuPeer, getPartnerAverageRating, getDrillingPartnerAverageEffectiveness, getSparringPartnerAverageStats, getInstructorAverageQuality } from '../utils/storage';

// Component for dynamic list builder
const DynamicListField = ({ field, value, onChange }) => {
  const [items, setItems] = useState(value || []);

  const addItem = () => {
    const newItem = {};
    field.itemSchema.forEach(schemaField => {
      newItem[schemaField.name] = '';
    });
    const newItems = [...items, newItem];
    setItems(newItems);
    onChange(newItems);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    onChange(newItems);
  };

  const updateItem = (index, fieldName, fieldValue) => {
    const newItems = [...items];
    newItems[index][fieldName] = fieldValue;
    setItems(newItems);
    onChange(newItems);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
      </label>
      <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
        {items.map((item, index) => (
          <div key={index} className="border border-gray-300 rounded-lg p-3 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                {field.label === 'Movements' ? 'Movement' : 'Exercise'} #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {field.itemSchema.map((schemaField) => (
                <div key={schemaField.name}>
                  {schemaField.type === 'text-or-select' ? (
                    <>
                      <label className="block text-xs text-gray-600 mb-1">
                        {schemaField.label}
                      </label>
                      <input
                        type="text"
                        list={`presets-${index}`}
                        value={item[schemaField.name] || ''}
                        onChange={(e) => updateItem(index, schemaField.name, e.target.value)}
                        placeholder={schemaField.placeholder}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
                      />
                      {field.presets && (
                        <datalist id={`presets-${index}`}>
                          {field.presets.map((preset) => (
                            <option key={preset} value={preset} />
                          ))}
                        </datalist>
                      )}
                    </>
                  ) : (
                    <>
                      <label className="block text-xs text-gray-600 mb-1">
                        {schemaField.label}
                      </label>
                      <input
                        type={schemaField.type}
                        value={item[schemaField.name] || ''}
                        onChange={(e) => updateItem(index, schemaField.name, e.target.value)}
                        placeholder={schemaField.placeholder}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addItem}
        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <Plus size={16} />
        Add {field.label === 'Movements' ? 'Movement' : 'Exercise'}
      </button>
    </div>
  );
};

// Component for Creatable Select with Belt Rank Modal
const CreatableSelectField = ({ field, value, onChange }) => {
  const [instructors, setInstructors] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBeltModal, setShowBeltModal] = useState(false);
  const [pendingInstructor, setPendingInstructor] = useState('');
  const [avgQuality, setAvgQuality] = useState(null);

  useEffect(() => {
    setInstructors(loadInstructors());
  }, []);

  // Update average quality when value changes
  useEffect(() => {
    if (value) {
      const quality = getInstructorAverageQuality(value);
      setAvgQuality(quality);
    } else {
      setAvgQuality(null);
    }
  }, [value]);

  const getBeltIcon = (beltRank) => {
    const beltEmojis = {
      'Blue': '🔵',
      'Purple': '🟣',
      'Brown': '🟤',
      'Black': '⚫',
      'Coral': '🔴'
    };
    return beltEmojis[beltRank] || '⚪';
  };

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (instructorName) => {
    onChange(instructorName);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleAddNew = () => {
    if (searchTerm.trim()) {
      setPendingInstructor(searchTerm.trim());
      setShowBeltModal(true);
      setIsDropdownOpen(false);
    }
  };

  const handleBeltRankSubmit = (beltRank) => {
    saveInstructor(pendingInstructor, beltRank);
    setInstructors(loadInstructors());
    onChange(pendingInstructor);
    setShowBeltModal(false);
    setPendingInstructor('');
    setSearchTerm('');
  };

  return (
    <div className="mb-4 relative">
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        {field.label}
        {avgQuality && (
          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-semibold">
            Avg: {avgQuality}/10
          </span>
        )}
      </label>
      
      {/* Selected Value or Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm || value || ''}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
            if (!e.target.value) onChange('');
          }}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder={field.placeholder}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
        />
        <ChevronDown 
          size={20} 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredInstructors.length > 0 ? (
              filteredInstructors.map((instructor, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(instructor.name)}
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center gap-2"
                >
                  <span>{getBeltIcon(instructor.beltRank)}</span>
                  <span className="text-gray-900">{instructor.name}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 text-sm">
                No instructors found
              </div>
            )}
            
            {searchTerm.trim() && !instructors.find(i => i.name.toLowerCase() === searchTerm.toLowerCase()) && (
              <button
                type="button"
                onClick={handleAddNew}
                className="w-full px-4 py-2 text-left hover:bg-green-50 border-t border-gray-200 text-green-600 font-medium flex items-center gap-2"
              >
                <Plus size={16} />
                Add "{searchTerm}"
              </button>
            )}
          </div>
        </>
      )}

      {/* Belt Rank Modal */}
      {showBeltModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Add Belt Rank for {pendingInstructor}
            </h3>
            <div className="space-y-2">
              {['Blue', 'Purple', 'Brown', 'Black', 'Coral'].map((belt) => (
                <button
                  key={belt}
                  type="button"
                  onClick={() => handleBeltRankSubmit(belt)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-blue-50 flex items-center gap-3 text-left"
                >
                  <span className="text-2xl">{getBeltIcon(belt)}</span>
                  <span className="font-medium text-gray-900">{belt} Belt</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setShowBeltModal(false);
                setPendingInstructor('');
              }}
              className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Component for Technique List with "Shown by Instructor" checkbox and Creatable Peer Select
const TechniqueListField = ({ field, value, onChange, localPeers, onPeerAdded }) => {
  const [techniques, setTechniques] = useState(value || []);
  const [inputValue, setInputValue] = useState('');
  const [peerSearchTerms, setPeerSearchTerms] = useState({});
  const [showPeerDropdowns, setShowPeerDropdowns] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [pendingPeerData, setPendingPeerData] = useState({ techIndex: null, peerName: '' });

  // Issue 2 Fix: Sync local state with value prop when editing
  useEffect(() => {
    if (value) {
      setTechniques(value);
    }
  }, [value]);

  const handleAddTechnique = () => {
    if (inputValue.trim()) {
      const newTechnique = {
        name: inputValue.trim(),
        shownByInstructor: true, // Default to TRUE
        peer: '',
        details: '' // Issue 3: Add details field
      };
      const newTechniques = [...techniques, newTechnique];
      setTechniques(newTechniques);
      onChange(newTechniques);
      setInputValue('');
    }
  };

  const handleRemoveTechnique = (index) => {
    const newTechniques = techniques.filter((_, i) => i !== index);
    setTechniques(newTechniques);
    onChange(newTechniques);
  };

  const handleUpdateTechnique = (index, field, value) => {
    const newTechniques = [...techniques];
    newTechniques[index][field] = value;
    setTechniques(newTechniques);
    onChange(newTechniques);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTechnique();
    }
  };

  const getBeltIcon = (beltRank) => {
    const beltEmojis = {
      'White': '⚪',
      'Blue': '🔵',
      'Purple': '🟣',
      'Brown': '🟤',
      'Black': '⚫',
      'Coral/Red': '🔴'
    };
    return beltEmojis[beltRank] || '⚪';
  };

  const handlePeerSelect = (index, peerName) => {
    handleUpdateTechnique(index, 'peer', peerName);
    setPeerSearchTerms(prev => ({ ...prev, [index]: '' }));
    setShowPeerDropdowns(prev => ({ ...prev, [index]: false }));
  };

  const handleAddNewPeer = (index, searchTerm) => {
    setPendingPeerData({ techIndex: index, peerName: searchTerm.trim() });
    setShowAddModal(true);
    setShowPeerDropdowns(prev => ({ ...prev, [index]: false }));
  };

  const handlePeerDataSubmit = (beltRank, weightClass) => {
    saveJiuJitsuPeer(pendingPeerData.peerName, beltRank, weightClass);
    onPeerAdded?.(); // Notify parent to refresh local peers
    handlePeerSelect(pendingPeerData.techIndex, pendingPeerData.peerName);
    setShowAddModal(false);
    setPendingPeerData({ techIndex: null, peerName: '' });
  };

  const getFilteredPeers = (index) => {
    const searchTerm = peerSearchTerms[index] || '';
    return (localPeers || []).filter(peer =>
      peer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="mb-4" data-list-type="technique">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
      </label>
      
      {/* Input for adding techniques */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={field.placeholder}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
        />
        <button
          type="button"
          onClick={handleAddTechnique}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {/* List of techniques */}
      {techniques.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {techniques.map((technique, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-3 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-gray-900">{technique.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTechnique(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={technique.shownByInstructor}
                  onChange={(e) => handleUpdateTechnique(index, 'shownByInstructor', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Shown by Instructor?</span>
              </label>

              {!technique.shownByInstructor && (
                <div className="relative">
                  <input
                    type="text"
                    value={peerSearchTerms[index] || technique.peer || ''}
                    onChange={(e) => {
                      setPeerSearchTerms(prev => ({ ...prev, [index]: e.target.value }));
                      setShowPeerDropdowns(prev => ({ ...prev, [index]: true }));
                      if (!e.target.value) handleUpdateTechnique(index, 'peer', '');
                    }}
                    onFocus={() => setShowPeerDropdowns(prev => ({ ...prev, [index]: true }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        const searchTerm = peerSearchTerms[index] || '';
                        if (searchTerm.trim()) {
                          // Check if peer exists
                          const existingPeer = (localPeers || []).find(p => p?.name?.toLowerCase() === searchTerm.toLowerCase());
                          if (existingPeer) {
                            handlePeerSelect(index, existingPeer.name);
                          } else {
                            // Add new peer
                            handleAddNewPeer(index, searchTerm);
                          }
                        }
                      }
                    }}
                    placeholder="Who showed this technique?"
                    className="w-full px-3 py-1.5 pr-8 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
                  />
                  <ChevronDown 
                    size={16} 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  />

                  {/* Peer Dropdown */}
                  {showPeerDropdowns[index] && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowPeerDropdowns(prev => ({ ...prev, [index]: false }))}
                      />
                      <div className="absolute z-30 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {getFilteredPeers(index).length > 0 ? (
                          getFilteredPeers(index).map((peer, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handlePeerSelect(index, peer.name)}
                              className="w-full px-3 py-2 text-left hover:bg-blue-50 flex items-center gap-2 text-sm"
                            >
                              <span>{getBeltIcon(peer.beltRank)}</span>
                              <span className="text-gray-900">{peer.name}</span>
                              <span className="text-xs text-gray-500 ml-auto">{peer.weightClass}</span>
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-gray-500 text-xs">
                            No peers found
                          </div>
                        )}
                        
                        {(peerSearchTerms[index] || '').trim() && 
                         !(localPeers || []).find(p => p?.name?.toLowerCase() === (peerSearchTerms[index] || '').toLowerCase()) && (
                          <button
                            type="button"
                            onClick={() => handleAddNewPeer(index, peerSearchTerms[index])}
                            className="w-full px-3 py-2 text-left hover:bg-green-50 border-t border-gray-200 text-green-600 font-medium flex items-center gap-2 text-sm"
                          >
                            <Plus size={14} />
                            Add "{peerSearchTerms[index]}"
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Issue 3: Add technique details/steps textarea */}
              <div className="mt-2">
                <label className="block text-xs text-gray-600 mb-1">
                  Key Details / Steps (optional)
                </label>
                <textarea
                  value={technique.details || ''}
                  onChange={(e) => handleUpdateTechnique(index, 'details', e.target.value)}
                  placeholder="e.g., Start from closed guard, control the sleeve..."
                  rows={2}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-white text-gray-900"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Partner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Add Partner: {pendingPeerData.peerName}
            </h3>
            
            <PartnerDataForm
              onSubmit={handlePeerDataSubmit}
              onCancel={() => {
                setShowAddModal(false);
                setPendingPeerData({ techIndex: null, peerName: '' });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Component for Drilling Partners with Rating and Analytics
const DrillingPartnersField = ({ field, value, onChange, localPeers, onPeerAdded }) => {
  const [partners, setPartners] = useState(value || []);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [pendingPartner, setPendingPartner] = useState('');

  // Issue 2 Fix: Sync local state with value prop when editing
  useEffect(() => {
    if (value) {
      setPartners(value);
    }
  }, [value]);

  const getBeltIcon = (beltRank) => {
    const beltEmojis = {
      'White': '⚪',
      'Blue': '🔵',
      'Purple': '🟣',
      'Brown': '🟤',
      'Black': '⚫',
      'Coral/Red': '🔴'
    };
    return beltEmojis[beltRank] || '⚪';
  };

  const filteredPeers = (localPeers || []).filter(peer =>
    peer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPartner = (peerName) => {
    const newPartner = {
      name: peerName,
      effectiveness: 5,
      firstTime: false
    };
    const newPartners = [...partners, newPartner];
    setPartners(newPartners);
    onChange(newPartners);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleAddNewPartner = () => {
    if (searchTerm.trim()) {
      setPendingPartner(searchTerm.trim());
      setShowAddModal(true);
      setIsDropdownOpen(false);
    }
  };

  const handlePartnerDataSubmit = (beltRank, weightClass) => {
    saveJiuJitsuPeer(pendingPartner, beltRank, weightClass);
    onPeerAdded?.(); // Notify parent to refresh local peers
    
    const newPartner = {
      name: pendingPartner,
      effectiveness: 5,
      firstTime: true
    };
    const newPartners = [...partners, newPartner];
    setPartners(newPartners);
    onChange(newPartners);
    
    setShowAddModal(false);
    setPendingPartner('');
    setSearchTerm('');
  };

  const handleRemovePartner = (index) => {
    const newPartners = partners.filter((_, i) => i !== index);
    setPartners(newPartners);
    onChange(newPartners);
  };

  const handleUpdatePartner = (index, field, value) => {
    const newPartners = [...partners];
    newPartners[index][field] = value;
    setPartners(newPartners);
    onChange(newPartners);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
      </label>

      {/* Partner Selection Input */}
      <div className="relative mb-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder={field.placeholder}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
        />
        <ChevronDown 
          size={20} 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        />

        {/* Dropdown */}
        {isDropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredPeers.length > 0 ? (
                filteredPeers.map((peer, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPartner(peer.name)}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center gap-2"
                  >
                    <span>{getBeltIcon(peer.beltRank)}</span>
                    <span className="text-gray-900">{peer.name}</span>
                    <span className="text-xs text-gray-500 ml-auto">{peer.weightClass}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500 text-sm">
                  No partners found
                </div>
              )}
              
              {searchTerm.trim() && !(localPeers || []).find(p => p?.name?.toLowerCase() === searchTerm.toLowerCase()) && (
                <button
                  type="button"
                  onClick={handleAddNewPartner}
                  className="w-full px-4 py-2 text-left hover:bg-green-50 border-t border-gray-200 text-green-600 font-medium flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add "{searchTerm}"
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* List of selected partners */}
      {partners.length > 0 && (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {partners.map((partner, index) => {
            // Support both new 'effectiveness' and legacy 'rating' fields
            const currentValue = partner.effectiveness || partner.rating || 5;
            const avgEffectiveness = getDrillingPartnerAverageEffectiveness(partner.name);
            return (
              <div key={index} className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-900">{partner.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePartner(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                {/* Effectiveness Input with Analytics Badge */}
                <div className="mb-2">
                  <label className="block text-xs text-gray-600 mb-1 flex items-center gap-2">
                    <span>Effectiveness (1-10)</span>
                    {avgEffectiveness && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                        Avg: {avgEffectiveness}
                      </span>
                    )}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentValue}
                    onChange={(e) => handleUpdatePartner(index, 'effectiveness', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span className="font-bold text-blue-600">{currentValue}</span>
                    <span>10</span>
                  </div>
                </div>

                {/* First Time Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={partner.firstTime || false}
                    onChange={(e) => handleUpdatePartner(index, 'firstTime', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">First time training with them?</span>
                </label>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Partner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Add Partner: {pendingPartner}
            </h3>
            
            <PartnerDataForm
              onSubmit={handlePartnerDataSubmit}
              onCancel={() => {
                setShowAddModal(false);
                setPendingPartner('');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Component for Technique Tag Input (Chip Input)
const TechniqueTagInput = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState([]);

  // Initialize tags from value (handle both string and array)
  useEffect(() => {
    if (Array.isArray(value)) {
      setTags(value);
    } else if (typeof value === 'string' && value.trim()) {
      // Convert legacy string to array
      setTags(value.split(',').map(t => t.trim()).filter(t => t));
    } else {
      setTags([]);
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput && !tags.includes(trimmedInput)) {
      const newTags = [...tags, trimmedInput];
      setTags(newTags);
      onChange(newTags);
      setInputValue('');
    }
  };

  const removeTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    onChange(newTags);
  };

  return (
    <div>
      {/* Display Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      {/* Input Field */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder="Type a technique and press Enter or Comma"
        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
      />
      <p className="text-xs text-gray-500 mt-1">Press Enter or Comma (,) to add</p>
    </div>
  );
};

// Component for Sparring Rounds with detailed feedback
const SparringRoundsField = ({ field, value, onChange, localPeers, onPeerAdded }) => {
  const [rounds, setRounds] = useState(value || []);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [pendingPartner, setPendingPartner] = useState('');
  const [expandedRounds, setExpandedRounds] = useState({});

  // Issue 2 Fix: Sync local state with value prop when editing
  useEffect(() => {
    if (value) {
      setRounds(value);
    }
  }, [value]);

  const getBeltIcon = (beltRank) => {
    const beltEmojis = {
      'White': '⚪',
      'Blue': '🔵',
      'Purple': '🟣',
      'Brown': '🟤',
      'Black': '⚫',
      'Coral/Red': '🔴'
    };
    return beltEmojis[beltRank] || '⚪';
  };

  const filteredPeers = (localPeers || []).filter(peer =>
    peer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPartner = (peerName) => {
    const newRound = {
      name: peerName,
      effectiveness: 5,
      aggressiveness: 5,
      whatTheyDidWell: '',
      whatTheyWereBadAt: '',
      techniquesIUsed: [],
      techniquesTheyUsed: []
    };
    const newRounds = [...rounds, newRound];
    setRounds(newRounds);
    onChange(newRounds);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleAddNewPartner = () => {
    if (searchTerm.trim()) {
      setPendingPartner(searchTerm.trim());
      setShowAddModal(true);
      setIsDropdownOpen(false);
    }
  };

  const handlePartnerDataSubmit = (beltRank, weightClass) => {
    saveJiuJitsuPeer(pendingPartner, beltRank, weightClass);
    onPeerAdded?.(); // Notify parent to refresh local peers
    
    const newRound = {
      name: pendingPartner,
      effectiveness: 5,
      aggressiveness: 5,
      whatTheyDidWell: '',
      whatTheyWereBadAt: '',
      techniquesIUsed: [],
      techniquesTheyUsed: []
    };
    const newRounds = [...rounds, newRound];
    setRounds(newRounds);
    onChange(newRounds);
    
    setShowAddModal(false);
    setPendingPartner('');
    setSearchTerm('');
  };

  const handleRemoveRound = (index) => {
    const newRounds = rounds.filter((_, i) => i !== index);
    setRounds(newRounds);
    onChange(newRounds);
    
    // Clean up expanded state
    const newExpanded = { ...expandedRounds };
    delete newExpanded[index];
    setExpandedRounds(newExpanded);
  };

  const handleUpdateRound = (index, field, value) => {
    const newRounds = [...rounds];
    newRounds[index][field] = value;
    setRounds(newRounds);
    onChange(newRounds);
  };

  const toggleExpanded = (index) => {
    setExpandedRounds(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
        {field.maxItems && (
          <span className="ml-2 text-xs text-gray-500">
            ({rounds.length}/{field.maxItems})
          </span>
        )}
      </label>

      {/* Partner Selection Input */}
      <div className="relative mb-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder={field.placeholder}
          disabled={field.maxItems && rounds.length >= field.maxItems}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <ChevronDown 
          size={20} 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        />

        {/* Dropdown */}
        {isDropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredPeers.length > 0 ? (
                filteredPeers.map((peer, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPartner(peer.name)}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center gap-2"
                  >
                    <span>{getBeltIcon(peer.beltRank)}</span>
                    <span className="text-gray-900">{peer.name}</span>
                    <span className="text-xs text-gray-500 ml-auto">{peer.weightClass}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500 text-sm">
                  No partners found
                </div>
              )}
              
              {searchTerm.trim() && !(localPeers || []).find(p => p?.name?.toLowerCase() === searchTerm.toLowerCase()) && (
                <button
                  type="button"
                  onClick={handleAddNewPartner}
                  className="w-full px-4 py-2 text-left hover:bg-green-50 border-t border-gray-200 text-green-600 font-medium flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add "{searchTerm}"
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* List of sparring rounds */}
      {rounds.length > 0 && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {rounds.map((round, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-3 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 flex-1">
                  <span className="font-medium text-gray-900">{round.name}</span>
                  {/* Issue 1 Fix: Make "Add Details" more prominent */}
                  <button
                    type="button"
                    onClick={() => toggleExpanded(index)}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                  >
                    {expandedRounds[index] ? (
                      <>
                        <ChevronUp size={14} />
                        <span>Hide Details</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown size={14} />
                        <span>Add Details</span>
                      </>
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveRound(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Expanded Details */}
              {expandedRounds[index] && (
                <div className="space-y-3 mt-3 pt-3 border-t border-gray-300">
                  {/* Effectiveness Slider */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Effectiveness/Technicality (1-10)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={round.effectiveness || round.rating || 5}
                      onChange={(e) => handleUpdateRound(index, 'effectiveness', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1</span>
                      <span className="font-bold text-blue-600">{round.effectiveness || round.rating || 5}</span>
                      <span>10</span>
                    </div>
                  </div>

                  {/* Aggressiveness Slider */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Aggressiveness (1-10)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={round.aggressiveness || 5}
                      onChange={(e) => handleUpdateRound(index, 'aggressiveness', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1</span>
                      <span className="font-bold text-red-600">{round.aggressiveness || 5}</span>
                      <span>10</span>
                    </div>
                  </div>

                  {/* What They Did Well */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      What went well
                    </label>
                    <textarea
                      value={round.whatTheyDidWell || ''}
                      onChange={(e) => handleUpdateRound(index, 'whatTheyDidWell', e.target.value)}
                      placeholder="e.g., Good guard passing, maintained pressure..."
                      rows={2}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-white text-gray-900"
                    />
                  </div>

                  {/* What They Were Bad At */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      What went wrong
                    </label>
                    <textarea
                      value={round.whatTheyWereBadAt || ''}
                      onChange={(e) => handleUpdateRound(index, 'whatTheyWereBadAt', e.target.value)}
                      placeholder="e.g., Weak mount escapes, struggled with submissions..."
                      rows={2}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-white text-gray-900"
                    />
                  </div>

                  {/* Techniques I Used - Tag/Chip Input (My Offense) */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Techniques I Used (My Offense)
                    </label>
                    <TechniqueTagInput
                      value={round.techniquesIUsed}
                      onChange={(value) => handleUpdateRound(index, 'techniquesIUsed', value)}
                    />
                  </div>

                  {/* Techniques They Used - Tag/Chip Input (Their Offense) */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Techniques They Used (Their Offense)
                    </label>
                    <TechniqueTagInput
                      value={round.techniquesTheyUsed}
                      onChange={(value) => handleUpdateRound(index, 'techniquesTheyUsed', value)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Partner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Add Partner: {pendingPartner}
            </h3>
            
            <PartnerDataForm
              onSubmit={handlePartnerDataSubmit}
              onCancel={() => {
                setShowAddModal(false);
                setPendingPartner('');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Partner Data Form Component with Gender-Specific Weight Classes
const PartnerDataForm = ({ onSubmit, onCancel }) => {
  const [beltRank, setBeltRank] = useState('');
  const [gender, setGender] = useState('Male');
  const [weightClass, setWeightClass] = useState('');

  const beltRanks = ['White', 'Blue', 'Purple', 'Brown', 'Black', 'Coral/Red'];
  
  // Gender-specific weight classes (IBJJF Standard)
  const weightClasses = {
    Male: [
      { name: 'Rooster', range: '<127 lbs' },
      { name: 'Light Feather', range: '127-141.5 lbs' },
      { name: 'Feather', range: '141.5-154.5 lbs' },
      { name: 'Light', range: '154.5-168 lbs' },
      { name: 'Middle', range: '168-181.5 lbs' },
      { name: 'Medium Heavy', range: '181.5-195 lbs' },
      { name: 'Heavy', range: '195-208 lbs' },
      { name: 'Super Heavy', range: '208-222 lbs' },
      { name: 'Ultra Heavy', range: '>222 lbs' },
      { name: 'Unknown', range: '' }
    ],
    Female: [
      { name: 'Rooster', range: '<107 lbs' },
      { name: 'Light Feather', range: '107-118 lbs' },
      { name: 'Feather', range: '118-129 lbs' },
      { name: 'Light', range: '129-141.5 lbs' },
      { name: 'Middle', range: '141.5-152.5 lbs' },
      { name: 'Medium Heavy', range: '152.5-163.5 lbs' },
      { name: 'Heavy', range: '163.5-175 lbs' },
      { name: 'Super Heavy', range: '>175 lbs' },
      { name: 'Unknown', range: '' }
    ]
  };

  const getBeltIcon = (belt) => {
    const beltEmojis = {
      'White': '⚪',
      'Blue': '🔵',
      'Purple': '🟣',
      'Brown': '🟤',
      'Black': '⚫',
      'Coral/Red': '🔴'
    };
    return beltEmojis[belt] || '⚪';
  };

  const handleSubmit = () => {
    if (beltRank && weightClass) {
      onSubmit(beltRank, weightClass);
    }
  };

  // Reset weight class when gender changes
  useEffect(() => {
    setWeightClass('');
  }, [gender]);

  return (
    <div>
      {/* Gender Toggle */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gender
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setGender('Male')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              gender === 'Male'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Male
          </button>
          <button
            type="button"
            onClick={() => setGender('Female')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              gender === 'Female'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Female
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Belt Rank
        </label>
        <div className="space-y-2">
          {beltRanks.map((belt) => (
            <button
              key={belt}
              type="button"
              onClick={() => setBeltRank(belt)}
              className={`w-full px-4 py-3 border rounded-lg hover:bg-blue-50 flex items-center gap-3 text-left transition-colors ${
                beltRank === belt ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' : 'border-gray-300'
              }`}
            >
              <span className="text-2xl">{getBeltIcon(belt)}</span>
              <span className="font-medium text-gray-900">{belt} Belt</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Weight Class (IBJJF {gender})
        </label>
        <select
          value={weightClass}
          onChange={(e) => setWeightClass(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
        >
          <option value="">Select weight class</option>
          {weightClasses[gender].map((wc) => (
            <option key={wc.name} value={wc.name}>
              {wc.name}{wc.range ? ` (${wc.range})` : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!beltRank || !weightClass}
          className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Add Partner
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Component for Social Context field
const SocialContextField = ({ isSolo, participants, onIsSoloChange, onParticipantsChange }) => {
  const [participantInput, setParticipantInput] = useState('');

  const handleAddParticipant = () => {
    if (participantInput.trim()) {
      const newParticipants = [...(participants || []), participantInput.trim()];
      onParticipantsChange(newParticipants);
      setParticipantInput('');
    }
  };

  const handleRemoveParticipant = (index) => {
    const newParticipants = (participants || []).filter((_, i) => i !== index);
    onParticipantsChange(newParticipants);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddParticipant();
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Social Context
      </label>
      
      {/* Checkbox */}
      <div className="mb-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isSolo}
            onChange={(e) => onIsSoloChange(e.target.checked)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            I did this activity on my own.
          </span>
        </label>
      </div>

      {/* Participants List Builder - Only shown if NOT solo */}
      {!isSolo && (
        <div className="mt-3 border border-gray-300 rounded-lg p-3 bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Who did you participate with?
          </label>
          
          {/* Display participants as tags */}
          {participants && participants.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {participants.map((participant, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {participant}
                  <button
                    type="button"
                    onClick={() => handleRemoveParticipant(index)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Input and Add Button */}
          <div className="flex gap-2">
            <input
              type="text"
              value={participantInput}
              onChange={(e) => setParticipantInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter name..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
            />
            <button
              type="button"
              onClick={handleAddParticipant}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Component for Recovery Advice display
const RecoveryAdvice = ({ workoutType, onClose }) => {
  const advice = getRecoveryAdvice(workoutType);

  if (!advice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Recovery Protocol</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed">{advice.text}</p>
        </div>
        {advice.link && (
          <a
            href={advice.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            <ExternalLink size={18} />
            Watch Guide: {advice.linkText}
          </a>
        )}
        <button
          onClick={onClose}
          className="mt-3 w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const FormField = ({ field, value, onChange, formData, localPeers, onPeerAdded }) => {
  const [tags, setTags] = useState(value || []);
  const [inputValue, setInputValue] = useState('');

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      // Check maxItems limit
      if (field.maxItems && tags.length >= field.maxItems) {
        alert(`You can only add up to ${field.maxItems} items.`);
        return;
      }
      const newTags = [...tags, inputValue.trim()];
      setTags(newTags);
      onChange(newTags);
      setInputValue('');
    }
  };

  const handleTagRemove = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    onChange(newTags);
  };

  // Helper function for historical run comparison
  const getRunComparison = () => {
    if (!formData.runDistance || !formData.runTimeMinutes) return '';
    
    try {
      const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
      const runLogs = logs.filter(log => 
        log.activityType === 'workout' && 
        log.cardioType === 'Run' &&
        log.runDistance && 
        log.runTimeMinutes
      );
      
      if (runLogs.length === 0) return 'First run logged!';
      
      // Calculate current pace
      const currentTotalMinutes = parseFloat(formData.runTimeMinutes) + (parseFloat(formData.runTimeSeconds || 0) / 60);
      const currentDistance = parseFloat(formData.runDistance);
      const currentUnit = formData.runDistanceUnit || 'Miles';
      
      // Convert all to miles for comparison
      const currentDistanceInMiles = currentUnit === 'Km' ? currentDistance * 0.621371 : currentDistance;
      const currentPacePerMile = currentTotalMinutes / currentDistanceInMiles;
      
      // Calculate average pace from historical runs
      let totalPaceSum = 0;
      let validRuns = 0;
      
      runLogs.forEach(log => {
        const logTotalMinutes = parseFloat(log.runTimeMinutes) + (parseFloat(log.runTimeSeconds || 0) / 60);
        const logDistance = parseFloat(log.runDistance);
        const logUnit = log.runDistanceUnit || 'Miles';
        const logDistanceInMiles = logUnit === 'Km' ? logDistance * 0.621371 : logDistance;
        const logPacePerMile = logTotalMinutes / logDistanceInMiles;
        
        if (logPacePerMile > 0 && logPacePerMile < 30) { // Sanity check
          totalPaceSum += logPacePerMile;
          validRuns++;
        }
      });
      
      if (validRuns === 0) return 'First run logged!';
      
      const avgPace = totalPaceSum / validRuns;
      const difference = avgPace - currentPacePerMile;
      const diffMinutes = Math.floor(Math.abs(difference));
      const diffSeconds = Math.round((Math.abs(difference) - diffMinutes) * 60);
      
      if (difference > 0.083) { // More than 5 seconds faster
        return `⚡ ${diffMinutes}:${diffSeconds.toString().padStart(2, '0')} faster than avg`;
      } else if (difference < -0.083) { // More than 5 seconds slower
        return `🐢 ${diffMinutes}:${diffSeconds.toString().padStart(2, '0')} slower than avg`;
      } else {
        return `📊 On pace with your average`;
      }
    } catch (error) {
      return '';
    }
  };

  switch (field.type) {
    case 'text':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
          />
        </div>
      );

    case 'number':
      // **ISSUE 2 FIX: Body Weight Max Limit**
      const handleNumberChange = (e) => {
        let inputValue = e.target.value;
        
        // Special handling for bodyWeight field
        if (field.name === 'bodyWeight' && inputValue) {
          const numValue = parseFloat(inputValue);
          const unit = formData.bodyWeightUnit || 'lbs';
          const maxLimit = unit === 'kg' ? 453 : 1000;
          
          // Clamp to max limit
          if (numValue > maxLimit) {
            inputValue = maxLimit.toString();
          }
        }
        
        onChange(inputValue);
      };
      
      // Calculate dynamic max for bodyWeight based on unit
      let dynamicMax = field.max;
      if (field.name === 'bodyWeight') {
        const unit = formData.bodyWeightUnit || 'lbs';
        dynamicMax = unit === 'kg' ? 453 : 1000;
      }
      
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="number"
            step="any"
            min={field.min}
            max={dynamicMax}
            value={value || ''}
            onChange={handleNumberChange}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
          />
        </div>
      );

    case 'time':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="time"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
          />
        </div>
      );

    case 'toggle':
      const currentValue = value || field.defaultValue || field.options[0];
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
          </label>
          <div className="flex gap-2">
            {field.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onChange(option)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentValue === option
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );

    case 'checkbox':
      return (
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value || field.defaultValue || false}
              onChange={(e) => onChange(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              {field.label}
            </span>
          </label>
        </div>
      );

    case 'calculated':
      const calculatedValue = field.calculate ? field.calculate(formData) : value;
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
          </label>
          <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-semibold">
            {calculatedValue || '—'}
          </div>
        </div>
      );

    case 'historical':
      const historicalValue = getRunComparison();
      if (!historicalValue) return null;
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
          </label>
          <div className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg bg-blue-50 text-blue-800 font-semibold">
            {historicalValue}
          </div>
        </div>
      );

    case 'link-button':
      return (
        <div className="mb-4">
          <a
            href={field.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            <ExternalLink size={18} />
            {field.buttonText}
          </a>
        </div>
      );

    case 'dynamic-list':
      return <DynamicListField field={field} value={value} onChange={onChange} />;

    case 'creatable-select':
      return <CreatableSelectField field={field} value={value} onChange={onChange} />;

    case 'technique-list':
      return <TechniqueListField field={field} value={value} onChange={onChange} localPeers={localPeers} onPeerAdded={onPeerAdded} />;

    case 'drilling-partners':
      return <DrillingPartnersField field={field} value={value} onChange={onChange} localPeers={localPeers} onPeerAdded={onPeerAdded} />;

    case 'sparring-rounds':
      return <SparringRoundsField field={field} value={value} onChange={onChange} localPeers={localPeers} onPeerAdded={onPeerAdded} />;

    case 'textarea':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-white text-gray-900"
          />
        </div>
      );

    case 'select':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            key={`${field.name}-${value}`}
            value={value || ''}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            required={field.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900 appearance-none"
            style={{ 
              backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem"
            }}
          >
            <option value="" className="text-gray-500">Select {field.label}</option>
            {field.options.map((option) => (
              <option key={option} value={option} className="text-gray-900">
                {option}
              </option>
            ))}
          </select>
        </div>
      );

    case 'slider':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}: <span className="font-bold text-blue-600">{value || field.defaultValue}</span>
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="range"
            min={field.min}
            max={field.max}
            step={field.step}
            value={value || field.defaultValue}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{field.min}</span>
            <span>{field.max}</span>
          </div>
        </div>
      );

    case 'tags':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
            {field.maxItems && (
              <span className="ml-2 text-xs text-gray-500">
                ({tags.length}/{field.maxItems})
              </span>
            )}
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(index)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleTagAdd}
            placeholder={field.placeholder}
            disabled={field.maxItems && tags.length >= field.maxItems}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      );

    default:
      return null;
  }
};

const GenericForm = ({ activityConfig, onSubmit, onCancel, editingLog = null }) => {
  const [formData, setFormData] = useState({});
  const [showRecovery, setShowRecovery] = useState(false);
  const [submittedWorkoutType, setSubmittedWorkoutType] = useState(null);
  const [localPeers, setLocalPeers] = useState([]);
  const formRef = useRef(null);

  // Load local peers for Jiu-Jitsu forms
  useEffect(() => {
    if (activityConfig.id === 'jiujitsu') {
      refreshLocalPeers();
    }
  }, [activityConfig.id]);

  const refreshLocalPeers = () => {
    const peers = loadJiuJitsuPeers();
    setLocalPeers(peers || []);
  };

  // Initialize default values including social context and smart defaults
  useEffect(() => {
    // If editing, populate with existing log data
    if (editingLog) {
      const restoredData = { ...editingLog };
      
      // **ISSUE 1 FIX: Jump Rope Edit Mode Hydration**
      if (editingLog.cardioType === 'Jump Rope' && editingLog.details) {
        console.log('Hydrating Jump Rope:', editingLog.details);
        
        // Explicitly map Jump Rope fields from details
        const skips = editingLog.details.skips || '';
        const ropeWeight = editingLog.details.ropeWeight || 2;
        const isWeighted = editingLog.details.isWeighted || false;
        const time = editingLog.details.time || '';
        
        // Derive tracking mode: if skips > 0, mode is 'Skips', otherwise 'Time'
        if (skips > 0) {
          restoredData.jumpRopeTrackingMode = 'Track by Skips';
          restoredData.jumpRopeSkips = skips;
        } else if (time > 0) {
          restoredData.jumpRopeTrackingMode = 'Track by Time';
          restoredData.jumpRopeTimeMinutes = time;
        } else {
          restoredData.jumpRopeTrackingMode = 'Track by Time';
        }
        
        // Restore rope weight data
        restoredData.jumpRopeWeighted = isWeighted;
        if (isWeighted) {
          restoredData.jumpRopeWeight = ropeWeight;
          restoredData.jumpRopeWeightUnit = editingLog.details.unit || 'lbs';
        }
      }
      
      setFormData(restoredData);
      return;
    }

    // Otherwise, set up defaults for new log
    const initialData = {};
    activityConfig.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initialData[field.name] = field.defaultValue;
      }
    });
    
    // Smart Body Weight: Get last recorded weight
    if (activityConfig.fields.some(f => f.name === 'bodyWeight')) {
      const lastWeight = getLastBodyWeight();
      initialData.bodyWeight = lastWeight.weight;
      initialData.bodyWeightUnit = lastWeight.unit;
    }
    
    // Add default social context based on activity type (unless it's Jiu-Jitsu)
    if (activityConfig.id !== 'jiujitsu') {
      const socialDefaults = getDefaultSocialContext(activityConfig.id);
      initialData.isSolo = socialDefaults.isSolo;
      initialData.participants = socialDefaults.participants;
    }
    
    setFormData(initialData);
  }, [activityConfig, editingLog]);

  // Bug 3 Fix: Clean slate sub-fields when parent category changes
  useEffect(() => {
    if (formData.workoutType) {
      // When workout type changes away from Cardio, reset cardio-specific fields
      if (formData.workoutType !== 'Cardio') {
        setFormData((prev) => {
          const newData = { ...prev };
          // Reset cardioType and all cardio-specific sub-fields
          delete newData.cardioType;
          delete newData.runDistance;
          delete newData.runDistanceUnit;
          delete newData.runTimeMinutes;
          delete newData.runTimeSeconds;
          delete newData.pace;
          delete newData.runComparison;
          delete newData.jumpRopeSkips;
          delete newData.jumpRopeTimeMinutes;
          delete newData.jumpRopeWeighted;
          delete newData.jumpRopeWeight;
          delete newData.cyclingDistance;
          delete newData.cyclingTimeMinutes;
          delete newData.cyclingFanBike;
          delete newData.swimmingDistance;
          delete newData.swimmingTimeMinutes;
          delete newData.hiitTimeMinutes;
          delete newData.hiitRounds;
          delete newData.rowingDistance;
          delete newData.rowingTimeMinutes;
          delete newData.dancingTimeMinutes;
          delete newData.dancingStyle;
          delete newData.cardioOtherName;
          delete newData.cardioOtherTimeMinutes;
          delete newData.calories;
          return newData;
        });
      }
    }
  }, [formData.workoutType]);

  // Bug 3 Fix: Reset cardio sub-type fields when cardioType changes
  useEffect(() => {
    if (formData.cardioType) {
      setFormData((prev) => {
        const newData = { ...prev };
        // Keep workoutType, cardioType, but reset all other cardio sub-fields
        delete newData.runDistance;
        delete newData.runDistanceUnit;
        delete newData.runTimeMinutes;
        delete newData.runTimeSeconds;
        delete newData.pace;
        delete newData.runComparison;
        delete newData.jumpRopeSkips;
        delete newData.jumpRopeTimeMinutes;
        delete newData.jumpRopeWeighted;
        delete newData.jumpRopeWeight;
        delete newData.jumpRopeWeightUnit;
        delete newData.jumpRopeTrackingMode;
        delete newData.cyclingDistance;
        delete newData.cyclingTimeMinutes;
        delete newData.cyclingFanBike;
        delete newData.swimmingDistance;
        delete newData.swimmingTimeMinutes;
        delete newData.hiitTimeMinutes;
        delete newData.hiitRounds;
        delete newData.rowingDistance;
        delete newData.rowingTimeMinutes;
        delete newData.dancingTimeMinutes;
        delete newData.dancingStyle;
        delete newData.cardioOtherName;
        delete newData.cardioOtherTimeMinutes;
        delete newData.calories;
        
        // Set defaults for Jump Rope
        if (prev.cardioType === 'Jump Rope') {
          newData.jumpRopeTrackingMode = 'Track by Time';
        }
        
        return newData;
      });
    }
  }, [formData.cardioType]);

  // Jump Rope tracking mode: Reset mode-specific fields when mode changes
  useEffect(() => {
    if (formData.cardioType === 'Jump Rope' && formData.jumpRopeTrackingMode) {
      setFormData((prev) => {
        const newData = { ...prev };
        // Reset mode-specific fields
        if (prev.jumpRopeTrackingMode === 'Track by Time') {
          delete newData.jumpRopeSkips;
        } else {
          delete newData.jumpRopeTimeMinutes;
        }
        return newData;
      });
    }
  }, [formData.jumpRopeTrackingMode]);

  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // If editing, preserve the id and timestamp
    const submitData = editingLog 
      ? { ...formData, id: editingLog.id, timestamp: editingLog.timestamp }
      : { activityType: activityConfig.id, ...formData };
    
    onSubmit(submitData, !!editingLog);

    // Show recovery advice if this is a workout (only for new logs, not edits)
    if (!editingLog && activityConfig.id === 'workout') {
      // For Cardio workouts, show recovery for the specific cardio type
      const recoveryType = formData.workoutType === 'Cardio' ? formData.cardioType : formData.workoutType;
      if (recoveryType) {
        setSubmittedWorkoutType(recoveryType);
        setShowRecovery(true);
      }
    }
  };

  // Priority 4: Global Enter Key Handler
  const handleFormKeyDown = (e) => {
    if (e.key === 'Enter') {
      const target = e.target;
      // Allow Enter in textareas and for the Save button
      if (target.tagName === 'TEXTAREA' || target.type === 'submit') {
        return;
      }
      // Prevent default form submission
      e.preventDefault();
      
      // Find if we're in a list input context and trigger the appropriate "Add" button
      const parentDiv = target.closest('[data-list-type]');
      if (parentDiv) {
        const addButton = parentDiv.querySelector('button[type="button"]');
        if (addButton && addButton.textContent.includes('Add')) {
          addButton.click();
        }
      }
    }
  };

  const handleRecoveryClose = () => {
    setShowRecovery(false);
    onCancel(); // Close the form after recovery advice
  };

  // Helper function to check if a field should be displayed
  const shouldDisplayField = (field) => {
    if (!field.conditional) return true;
    
    // Handle multiple conditional checks
    const conditionField = field.conditional.field;
    const conditionValue = field.conditional.value;
    const negate = field.conditional.negate;
    
    // Check if the condition field exists in formData
    const currentValue = formData[conditionField];
    
    // For cardioType === 'Jump Rope' check on intensity (should hide intensity)
    if (field.name === 'intensity' && conditionField === 'cardioType') {
      const isJumpRope = currentValue === 'Jump Rope';
      // negate: true means show when NOT Jump Rope
      return negate ? !isJumpRope : isJumpRope;
    }
    
    // For jumpRopeTrackingMode conditionals
    if (conditionField === 'jumpRopeTrackingMode') {
      // First check if we're in Jump Rope mode
      if (formData.cardioType !== 'Jump Rope') return false;
      const trackingMode = formData.jumpRopeTrackingMode || 'Track by Time';
      const conditionMet = trackingMode === conditionValue;
      return negate ? !conditionMet : conditionMet;
    }
    
    const conditionMet = currentValue === conditionValue;
    return negate ? !conditionMet : conditionMet;
  };

  return (
    <>
      <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} ref={formRef} className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingLog ? `Edit ${activityConfig.label}` : `I Just ${activityConfig.label}`}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 flex-1">
          {activityConfig.fields.map((field) => 
            shouldDisplayField(field) && (
              <FormField
                key={field.name}
                field={field}
                value={formData[field.name]}
                onChange={(value) => handleFieldChange(field.name, value)}
                formData={formData}
                localPeers={localPeers}
                onPeerAdded={refreshLocalPeers}
              />
            )
          )}
          
          {/* Social Context Section - Universal for all activities except Jiu-Jitsu */}
          {activityConfig.id !== 'jiujitsu' && (
            <SocialContextField
              isSolo={formData.isSolo}
              participants={formData.participants}
              onIsSoloChange={(value) => handleFieldChange('isSolo', value)}
              onParticipantsChange={(value) => handleFieldChange('participants', value)}
            />
          )}
        </div>

        <div className="flex gap-3 p-6 pt-4 flex-shrink-0 border-t border-gray-200 bg-white">
          <button
            type="submit"
            className={`flex-1 ${activityConfig.color} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity`}
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      {showRecovery && (
        <RecoveryAdvice 
          workoutType={submittedWorkoutType} 
          onClose={handleRecoveryClose}
        />
      )}
    </>
  );
};

export default GenericForm;
