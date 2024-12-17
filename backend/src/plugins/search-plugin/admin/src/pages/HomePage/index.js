import React, { useState } from 'react';
import { TextInput, Button, Box, Typography } from '@strapi/design-system';
import axios from 'axios';

const Homepage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/search-plugin/search?query=${query}`);
      setResults(response.data.data);
      setSelectedEntry(null);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <Box padding={8} background="neutral100">
      <Typography variant="alpha">Search in Test Collection</Typography>
      <Box paddingTop={4} paddingBottom={4}>
        <TextInput
          placeholder="Type to search..."
          value={query}
          label="Tedst"
          onChange={(e) => setQuery(e.target.value)}
        />
      </Box>
      <Button onClick={handleSearch}>Search</Button>

      {results.length > 0 && (
        <Box paddingTop={6}>
          <Typography variant="beta">Results:</Typography>
          <ul>
            {results.map((entry) => (
              <li key={entry.id}>
                <Button
                  variant="secondary"
                  onClick={() => setSelectedEntry(entry)}
                >
                  {entry.name}
                </Button>
              </li>
            ))}
          </ul>
        </Box>
      )}

      {selectedEntry && (
        <Box paddingTop={6}>
          <Typography variant="beta">Details:</Typography>
          <Typography>ID: {selectedEntry.id}</Typography>
          <Typography>Name: {selectedEntry.name}</Typography>
          <Typography>Description: {selectedEntry.description}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Homepage;
