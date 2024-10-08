// src/pages/SelectGroupPage.js
import React, { useState } from 'react';
import GroupSelection from '../components/GroupSelection';
import { getContract, getContract2 } from '../contractConfig';
import { ethers } from 'ethers';
import axios from 'axios';
import './App.css';
import Footer from '../Footer';



const SelectGroupPage = ({ setSelectedGroup }) => {
  const [selectedGroup, setSelectedGroupState] = useState(null);
  const [amount, setAmount] = useState('');
  const [chatId,setChatid] = useState('');

 

  const handlePayment = async () => {
    if (!selectedGroup) {
      alert('Por favor, selecione um grupo primeiro.');
      return;
    }
    
    const CONTRACT_ADDRESS2 = "0x6Ba83cc4D7D9b7b2f3B8421e56FE9E54AD89e9A5";
   
   

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = getContract(signer);
    const contract2 = getContract2(signer);

    try {

     const tx2 = await contract2.approve(CONTRACT_ADDRESS2, ethers.utils.parseUnits(amount, 18));
     alert('Pagamento sendo processado');
     await tx2.wait();
      const tx = await contract.pay(selectedGroup.id, ethers.utils.parseUnits(amount, 18)); // USDT usa 6 casas decimais
      await tx.wait();
      alert('Pagamento realizado com sucesso');
      sendMessage();
    } catch (error) {
      console.error('Falha no pagamento:', error);
      alert('Falha no pagamento');
    }
  };
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    cep: '',
    produto: '',
    bairro: '',
  });
 
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    
   
  };
  const sendMessage = async () => {
    const token = '7399236144:AAE1z92lc-Oy9Mon4snPWx2Nzul1LS7DNh4';//'6777312253:AAHnEyhYfNPB8_t675-rdbYgE1xaXQYp8ho';
   
    const imageUrl = formData.produto;
    

    try {
      await axios.post(`https://api.telegram.org/bot${token}/sendPhoto`, 
        {
        chat_id: chatId,
        photo: imageUrl,
        caption: formData.hash
      });
      alert('Imagem e descrição enviadas com sucesso!');
    } catch (error) {
      alert('Erro ao enviar imagem e descrição');
      console.error('Erro ao enviar:', error);
    }
  };

  const handleGroupSelection = (group) => {
    setSelectedGroup(group);
    setSelectedGroupState(group);
    setAmount(group.value);
    setChatid(group.telegramId);
  };

  return (
    <div className ="App" >
      <GroupSelection setSelectedGroup={handleGroupSelection} />

      
     
    </div>
  );
};

export default SelectGroupPage;
