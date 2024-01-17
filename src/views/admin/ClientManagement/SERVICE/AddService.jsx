import React from 'react'
import { useState, useEffect, useMemo } from "react";
import { useAuthContext } from 'views/auth/hooks/useAuthContext'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdList, MdShower } from 'react-icons/md';
import ContratList from './ContratList';
import EquipementList from './EquipementList';
const AddService = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isEquipementModalOpen, setEquipementModalOpen] = useState(false);
    const [client, setClient] = useState('')
    const [quantity, setquantity] = useState('')

    const [equipement, setequipement] = useState('')
    const [model, setModel] = useState('')
    const [contrat, setcontrat] = useState('')
    const [effective_date, seteffective_date] = useState('')
    const [termination_date, settermination_date] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [services, setServices] = useState([]);
    const [selectedContratSn, setSelectedContratSn] = useState("")
    const [selectedContratId, setSelectedContratId] = useState("")
    const [selectedEquipementSn, setselectedEquipementSn] = useState([])
    const default_response_time_critical = 2;
    const default_response_time_major = 4;
    const default_response_time_minor = 24;
    const defaultTime = '08:00';
    const defaultTimeEnd = '20:00';
    const [working_hour_start, setworking_hour_start] = useState(defaultTime)
    const [working_hour_end, setworking_hour_end] = useState(defaultTimeEnd)
    const [response_time_critical, setresponse_time_critical] = useState(default_response_time_critical)
    const [response_time_major, setresponse_time_major] = useState(default_response_time_major)
    const [response_time_minor, setresponse_time_minor] = useState(default_response_time_minor)

    const handleTimeChange = (e) => {
        setworking_hour_start(e.target.value);
    };
    const handleTimeChangeEnd = (e) => {
        setworking_hour_end(e.target.value);
    };
    // MODAL //
    const openContratModal = () => {
        setModalOpen(true);
    };
    const closeContratModal = () => {
        setModalOpen(false);
    };
    const openEquipementModal = () => {
        setEquipementModalOpen(true);
    };
    const closeEquipementModal = () => {
        setEquipementModalOpen(false);
    };
    const handleContratSelection = (contratInfo) => {
        setSelectedContratSn(contratInfo.contrat_sn);
        const formattedEffectiveDate = new Date(contratInfo.effective_date).toISOString().split('T')[0];
        seteffective_date(formattedEffectiveDate);
        const formattedTerminationDate = new Date(contratInfo.termination_date).toISOString().split('T')[0];
        settermination_date(formattedTerminationDate);
        setSelectedContratId(contratInfo._id);
        console.log("Selected client ID:", contratInfo._id);
        closeContratModal();
    };/*
    const handleEquipementSelection = (selectedEquipements) => {
        // Iterate over the selectedEquipements array
        for (const equipement of selectedEquipements) {
          console.log("Selected Equipement ID:", equipement._id);
      
          // Log or use other properties of the equipement object
          console.log('Equipement Data:', equipement);
          
          // Access other properties of the equipement object
          const equipementSN = equipement.equipement_sn;
          console.log('Equipement S/N:', equipementSN);
      
          // Perform other actions with the equipement data
          // ...
        }
      };*/
    const handleEquipementSelection = (selectedEquipements) => {
        // Extract equipement_sn values from the selectedEquipements array
        const equipementSns = selectedEquipements.map(equipement => equipement.equipement_sn);

        // Concatenate the serial numbers into a string
        const equipementSnsString = equipementSns.join(', ');

        // Update the state with the concatenated serial numbers
        setselectedEquipementSn(equipementSnsString);
    };


    // Ajout de service //
    const handleSubmit = async (e) => {
        e.preventDefault();
        const clients = {
            //client: selectedClientId,
            //service_cn,
            //contrat_sn,
            effective_date, termination_date
        };
        //console.log(clients);
        try {
            const response = await fetch('/api/service/add', {
                method: 'POST',
                body: JSON.stringify(clients),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const json = await response.json();
            console.log(json);
            if (!response.ok) {
                if (json.error) {
                    setError(json.error);
                }
                if (json.emptyFields) {
                    setEmptyFields(json.emptyFields);
                }
            }
            if (response.ok) {
                setEmptyFields([]);
                setClient('');
                seteffective_date('');
                settermination_date('');
                setError(null);
                toast.success('Service ajouté avec succès');
                setSuccessMessage("Service ajouté avec succès");
                console.log('Request sent successfully');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Une erreur s\'est produite lors de la soumission du formulaire.');
        }
    };

    return (
        <div className="overflow-x-auto">
            <ToastContainer />

            <h1 className="text-[1.7em]  mb-2.5 mx-0 text-center font-semibold dark:text-gray-600">Ajouter Service:</h1>
            <div className="space-y-1">
                <div className="border-b border-gray-900/10 pb-12">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3 relative">
                            <label htmlFor="client" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-600">Contrat</label>
                            <div className="flex">
                                <input
                                    type="text"
                                    placeholder={selectedContratSn ? selectedContratSn : ''}
                                    value={selectedContratSn ? selectedContratSn : ''}
                                    onClick={openContratModal}
                                    className="block w-full border-red-700 rounded-md border-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 cursor-pointer"
                                />

                                <MdList className="h-6 w-6 ml-2.5 mt-1.5 text-gray-700" />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="model" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-600">Model</label>
                            <div >
                                <input type="text"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    className="block w-full border-red-700 rounded-md border-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="quantity" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-600">Quantité équipement</label>
                            <div >
                                <input type="number"
                                    value={quantity}
                                    onChange={(e) => setquantity(e.target.value)}
                                    className="block w-full border-red-700 rounded-md border-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />                    </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="equipement" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-600">Equipement S/N</label>
                            <div>
                                <input
                                    type="text"
                                    onClick={openEquipementModal}
                                    placeholder={selectedEquipementSn ? selectedEquipementSn : ''}
                                    value={selectedEquipementSn ? selectedEquipementSn : ''}
                                    readOnly
                                    className="block w-full border-red-700 rounded-md border-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 cursor-pointer"
                                />
                            </div>

                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="termination_date" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-600">Garantie Start Date </label>
                            <div >
                                <input type="Date"
                                    value={effective_date}
                                    onChange={(e) => settermination_date(e.target.value)}
                                    className="block w-full border-red-700 rounded-md border-2  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="termination_date" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-600">Garantie termination Date </label>
                            <div >
                                <input type="Date"
                                    value={termination_date}
                                    onChange={(e) => settermination_date(e.target.value)}
                                    className="block w-full border-red-700 rounded-md border-2  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="termination_date" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-600">heure de travail </label>
                            <div className="flex">
                                <input type="time"
                                    value={working_hour_start}
                                    onChange={handleTimeChange}
                                    className="block border-red-700 rounded-md border-2  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />

                                <input type="time"
                                    value={working_hour_end}
                                    onChange={handleTimeChangeEnd}
                                    className="block ml-5 border-red-700 rounded-md border-2  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="termination_date" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-600">Response time </label>
                            <div className="flex">
                                <label htmlFor="termination_date" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-600">critical </label>
                                <input type="number"
                                    value={response_time_critical}
                                    onChange={(e) => setresponse_time_critical(e.target.value)}
                                    className="ml-2 w-20 block border-red-700 rounded-md border-2  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                <label htmlFor="termination_date" className="ml-2 block text-sm font-medium leading-6 text-gray-900 dark:text-gray-600">major </label>

                                <input type="number"
                                    value={response_time_major}
                                    onChange={(e) => setresponse_time_major(e.target.value)}
                                    className="ml-2  w-20 block ml-5 border-red-700 rounded-md border-2  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                <label htmlFor="termination_date" className="ml-2 block text-sm font-medium leading-6 text-gray-900 dark:text-gray-600">minor </label>

                                <input type="number"
                                    value={response_time_minor}
                                    onChange={(e) => setresponse_time_minor(e.target.value)}
                                    className="ml-2 ml-2  w-20 block ml-5 border-red-700 rounded-md border-2  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-x-6">
                <button type="button" className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={handleSubmit}>Valider</button>
                <button type="button" className="rounded-md bg-indigo-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Annuler</button>
            </div>
            {error && <div className="error border rounded mx-0 my-5 p-2.5 border-solid bg-red-300">{error}</div>}
            {successMessage && <div className="success border rounded mx-0 my-5 p-2.5 border-solid bg-green-300">{successMessage}</div>}
            {isModalOpen && <ContratList handleClose={closeContratModal} handleContratSelection={handleContratSelection} />}
            {isEquipementModalOpen && <EquipementList handleClose={closeEquipementModal} handleEquipementSelection={handleEquipementSelection} />}

        </div>)
}

export default AddService