import React, { useState, useEffect } from 'react';
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Container,
  Box,
} from '@mui/material';

const DynamicForm = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [submittedDataList, setSubmittedDataList] = useState<{ [key: string]: any }[]>([]);

  useEffect(() => {
    const fetchConfig = async () => {
      const response = await fetch('/src/formConfig.json');
      const data = await response.json();
      setCompanies(data.companies);
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      const company = companies.find((comp) => comp.name === selectedCompany);
      setFields(company?.fields || []);
      setFormData({});
    }
  }, [selectedCompany, companies]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);

    setSubmittedDataList((prevList) => [...prevList, formData]);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Formulário Dinâmico
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Escolha uma Companhia</InputLabel>
        <Select
          value={selectedCompany || ''}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          {companies.map((company) => (
            <MenuItem key={company.name} value={company.name}>
              {company.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedCompany && (
        <form onSubmit={handleSubmit}>
          {fields.map((field, index) => (
            <div key={index}>
              {field.type === 'textarea' ? (
                <TextField
                  label={field.label}
                  name={field.label}
                  value={formData[field.label] || ''}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  fullWidth
                  margin="normal"
                  required={field.required}
                />
              ) : field.type === 'select' ? (
                <FormControl fullWidth margin="normal">
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    name={field.label}
                    value={formData[field.label] || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field.label]: e.target.value,
                      }))
                    }
                    required={field.required}
                  >
                    {field.options.map((option: string, i: number) => (
                      <MenuItem key={i} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  type={field.type}
                  label={field.label}
                  name={field.label}
                  value={formData[field.label] || ''}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required={field.required}
                  inputProps={field.pattern ? { pattern: field.pattern } : undefined}
                />
              )}
            </div>
          ))}
          <Button type="submit" variant="contained" color="primary">
            Submeter
          </Button>
        </form>
      )}

      {submittedDataList.length > 0 && (
        <Box mt={4} p={2} border={1} borderColor="grey.400" borderRadius={2}>
          <Typography variant="h6">Dados Submetidos:</Typography>
          {submittedDataList.map((data, index) => (
            <pre key={index}>{JSON.stringify(data, null, 2)}</pre>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default DynamicForm;
