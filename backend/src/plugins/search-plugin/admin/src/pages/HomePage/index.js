import React, { useState } from 'react';
import { TextInput, Button, Box, Typography } from '@strapi/design-system';
import { Search } from '@strapi/icons';
import { useIntl } from "react-intl";
import axios from 'axios';

const Homepage = () => {
  const { formatMessage } = useIntl();

  const [code, setCode] = useState('');
  const [results, setResults] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/search-plugin/search?code=${code}`);
      setResults(response.data.data);
      setSelectedEntry(null);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <Box padding={8} background="neutral100">
      <Typography variant="alpha">{formatMessage({id:'search-plugin.plugin.name'})}</Typography>

      <div style={{display: 'flex'}}>
        <div style={{width:"85%"}}>
          <TextInput
              placeholder={formatMessage({id:'search-plugin.input.search'})}
              value={code}
              label={formatMessage({id:'search-plugin.label.search'})}
              onChange={(e) => setCode(e.target.value)}
            />
        </div>
        <div style={{width:"15%",display: "flex", alignItems: "flex-end", justifyContent: "center"}}>
          <Button onClick={handleSearch} size="L">
            <Search /> {formatMessage({id:'search-plugin.button.search'})}
          </Button>
        </div>
      </div>

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
