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

      <div style={{display: 'flex', paddingTop:"1rem"}}>
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
        <div style={{paddingTop:"1rem"}}>
          <Typography variant="beta">Results:</Typography>
            <div style={{display:"flex", flexWrap:"wrap", paddingTop:"0.5rem"}}>
                {results.map((result) => (
                    <div 
                      style={{width: "16%", paddingLeft:"0.5rem", paddingRight:"0.5rem"}}
                      key={result.id}
                    >
                <Button
                        style={{width: "100%", justifyContent:"center"}}
                  variant="secondary"
                        size="L"
                        onClick={() => setSelectedEntry(result)}
                >
                        {result.code}
                </Button>
                    </div>
            ))}
            </div>
        </div>
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
