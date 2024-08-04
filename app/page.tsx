'use client';
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button } from '@mui/material';
import { collection, deleteDoc, doc, query, getDocs, getDoc, setDoc } from 'firebase/firestore';

// Define the InventoryItem interface
interface InventoryItem {
  id: string;
  quantity: number;
}

export default function Home() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList: InventoryItem[] = []; // Explicitly type the array
      docs.forEach((doc) => {
        inventoryList.push({
          id: doc.id,
          ...(doc.data() as InventoryItem),
        });
      });
      setInventory(inventoryList);
      setFilteredInventory(inventoryList);
    } catch (error) {
      console.error("Error fetching inventory: ", error);
    }
  };

  const addItem = async (item: string) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const { quantity } = docSnap.data() as InventoryItem;
      await setDoc(docRef, { quantity: quantity + 1 }, { merge: true });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item: string) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data() as InventoryItem;
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 }, { merge: true });
      }
      await updateInventory();
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    const filtered = inventory.filter(item =>
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInventory(filtered);
  }, [searchQuery, inventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setItemName(''); // Reset itemName when modal is closed
  };

  return (
    <Box 
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Button variant="contained" onClick={handleOpen}>Add Item</Button> 

      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute" 
          top="50%" 
          left="50%"
          width={400}
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="column" spacing={2}>
            <TextField 
              variant="outlined"
              fullWidth
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button 
              variant="contained" 
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box border="1px solid #333" width="800px" height="100px" bgcolor="#ADD8E6" display="flex" alignItems="center" justifyContent="center">
        <Typography variant='h2' color="#333">
          Pantry Items
        </Typography>
      </Box>

      <TextField 
        variant="outlined" 
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ 
          width: '800px', 
          marginBottom: 2, 
          backgroundColor: '#FFFFFF', // Background color
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#333', // Border color
            },
            '&:hover fieldset': {
              borderColor: '#000', // Border color on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000', // Border color when focused
            },
          },
        }}
      />


      <Stack width="800px" height="300px" spacing={2} overflow="auto">
        {filteredInventory.length === 0 ? (
          <Typography>No items in inventory</Typography>
        ) : (
          filteredInventory.map(({ id, quantity }) => (
            <Box 
              bgcolor="#ADD8E6"
              border="2px solid #333"
              key={id} 
              width="100%" 
              minHeight="150px" 
              display="flex"
              alignItems="center" 
              justifyContent="space-between" 
              padding={2}
            >
              <Typography variant="h6" color="#333" textAlign="center">
                {id.charAt(0).toUpperCase() + id.slice(1)} 
              </Typography>
              <Typography variant="h6" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="contained" 
                  onClick={() => addItem(id)}
                >
                  Add
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => removeItem(id)}
                >
                  Remove
                </Button>
              </Stack>
            </Box> 
          ))
        )}
      </Stack>
    </Box>
  );
}
