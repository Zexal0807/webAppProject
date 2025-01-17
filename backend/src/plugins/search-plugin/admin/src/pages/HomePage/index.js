import React, { useState } from 'react';
import { Textarea, TextInput, DateTimePicker, Button, Box, Typography } from '@strapi/design-system';
import { Search, Archive } from '@strapi/icons';
import { useIntl } from "react-intl";
import { useNotification } from '@strapi/helper-plugin';
import axios from 'axios';

const Homepage = () => {
  const { formatMessage } = useIntl();
  const toggleNotification = useNotification();

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

  const handleSave = async (e) => {
    try {
      const response = await axios.put(`/api/test-executions/${selectedEntry.id}`, {
        revision_date: new Date(),
        note: selectedEntry.note
      });
      toggleNotification({ type: 'success', message: formatMessage({id:'search-plugin.notification.success'}) });
      handleSearch();
    } catch (error) {
      console.error('Error fetching search results:', error);
      toggleNotification({ type: 'warning', message: formatMessage({id:'search-plugin.notification.failed'}) });
    }
  }

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
        <div style={{width:"15%", display: "flex", alignItems: "flex-end", justifyContent: "center"}}>
          <Button onClick={handleSearch} size="L">
            <Search /> {formatMessage({id:'search-plugin.button.search'})}
          </Button>
        </div>
      </div>

      {results.length > 0 && (
        <div style={{paddingTop:"1rem"}}>
            <Typography variant="beta">{formatMessage({id:'search-plugin.results.title'})}:</Typography>
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
                        onClick={() => { setSelectedEntry(result) }}
                      >
                        {result.code}
                      </Button>
                    </div>
                ))}
            </div>
        </div>
      )}

      {selectedEntry && (
        <div style={{paddingTop:"1rem"}}>
          <Typography variant="beta">{formatMessage({id:'search-plugin.details.title'})}:</Typography>
          <br />

          <div style={{width:"100%", display: "flex", paddingTop:"0.5rem"}}>
            <div style={{width:"33%", paddingRight:"1rem"}}>
              <TextInput
                label={formatMessage({id:'search-plugin.label.code'})}
                disabled={true}
                value={selectedEntry.code}
              />
            </div>
            <div style={{width:"67%", paddingLeft:"1rem"}}>
              <TextInput
                label={formatMessage({id:'search-plugin.label.testname'})}
                disabled={true}
                value={selectedEntry.test.name}
              />
            </div>
          </div>

          <div style={{width:"100%", paddingTop:"0.5rem"}}>
            <Textarea
              label={formatMessage({id:'search-plugin.label.testdescription'})}
              disabled={true}
              value={selectedEntry.test.description}
            />
          </div>

          <div style={{width:"100%", display: "flex", paddingTop:"0.5rem"}}>
            <div style={{width:"16.8%", paddingRight:"1rem"}}>
              <TextInput
                label={formatMessage({id:'search-plugin.label.sex'})}
                disabled={true}
                value={selectedEntry.sex.name}
              />
            </div>
            <div style={{width:"16.8%", paddingLeft:"1rem", paddingRight:"1rem"}}>
              <TextInput
                label={formatMessage({id:'search-plugin.label.age'})}
                disabled={true}
                value={selectedEntry.age}
              />
            </div>
            <div style={{width:"22.2%", paddingRight:"1rem", paddingLeft:"1rem"}}>
              <TextInput
                label={formatMessage({id:'search-plugin.label.ip'})}
                disabled={true}
                value={selectedEntry.IP}
              />
            </div>
            <div style={{width:"33.3%", paddingRight:"1rem", paddingLeft:"1rem"}}>
              <DateTimePicker
                label={formatMessage({id:'search-plugin.label.execution_time'})}
                disabled={true}
                value={selectedEntry.execution_time}
              />
            </div>
            <div style={{width:"10.9%", paddingLeft:"1rem"}}>
              <TextInput
                label={formatMessage({id:'search-plugin.label.score'})}
                disabled={true}
                value={selectedEntry.score}
              />
            </div>
          </div>

          <div style={{ 
            color: "rgb(50, 50, 77)", 
            fontSize: "0.75rem", 
            fontWeight: "600", 
            paddingTop:"0.5rem", 
            paddingBottom: "0rem"
            }}>
            {formatMessage({id:'search-plugin.label.questions'})}:
          </div>

          <div style={{paddingLeft: "1rem", paddingRight:"1rem"}}>
            {selectedEntry.answers.map(answer => (
              <div style={{width:"100%", display: "flex", paddingTop:"0.5rem"}}>
                <div style={{width:"91.6%", paddingRight:"1rem"}}>
                  <TextInput
                    label={answer.question.text}
                    disabled={true}
                    value={answer.text}
                  />
                  {answer.score == 0 && (
                    <span style={{ color: "rgb(208, 43, 32)", fontSize: "0.75rem", fontWeight: "600" }}>
                      {answer.correction}
                    </span>
                  )}
                </div>
                <div style={{width:"8.4%", paddingLeft:"1rem", paddingRight:"1rem"}}>
                  <TextInput
                    label={formatMessage({id:'search-plugin.label.score'})}
                    disabled={true}
                    value={answer.score}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{width:"100%", display: "flex", paddingTop:"1rem"}}>
            <div style={{width:"33%", paddingRight:"1rem"}}>
              <DateTimePicker
                label={formatMessage({id:'search-plugin.label.revision_date'})}
                disabled={true}
                value={selectedEntry.revision_date}
              />
            </div>
            <div style={{width:"67%", paddingLeft:"1rem"}}>
              <Textarea
                label={formatMessage({id:'search-plugin.label.note'})}
                onChange={(e) => {
                  setSelectedEntry({ ...selectedEntry, note: e.target.value});
                }}
                value={selectedEntry.note ? selectedEntry.note : ""}
              />
            </div>
          </div>

          <div style={{width:"100%", display: "flex", paddingTop:"1rem"}}>
            <Button onClick={handleSave} size="L">
              <Archive /> {formatMessage({id:'search-plugin.button.save'})}
            </Button>
          </div>

        </div>
      )}
    </Box>
  );
};

export default Homepage;
