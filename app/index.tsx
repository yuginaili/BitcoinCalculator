import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';
import axios from 'axios';

interface Inputs {
  hashRate: string;
  power: string;
  cost: string;
}

interface Result {
  profitability: number;
}

const CalculatorScreen = () => {
  const [inputs, setInputs] = useState<Inputs>({hashRate: '', power: '', cost: ''});
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  const handleChange = (field: keyof Inputs, value: string) => {
    setInputs({...inputs, [field]: value});
  };

  const calculate = async () => {
    if (!inputs.hashRate || !inputs.power || !inputs.cost) {
      setError('All fields are required.');
      return;
    }

    if (isNaN(Number(inputs.hashRate)) || isNaN(Number(inputs.power)) || isNaN(Number(inputs.cost))) {
      setError('Inputs must be numeric.');
      return;
    }

    try {
      const response = await axios.post<Result>(
        'http://localhost:3000/calculate',
        inputs,
      );
      setResult(response.data);
    } catch (err) {
      setError('Error fetching data. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bitcoin Mining Calculator</Text>

      <TextInput
        style={styles.input}
        placeholder="Hash Rate (TH/s)"
        keyboardType="numeric"
        onChangeText={text => handleChange('hashRate', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Power Consumption (W)"
        keyboardType="numeric"
        onChangeText={text => handleChange('power', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Electricity Cost ($/kWh)"
        keyboardType="numeric"
        onChangeText={text => handleChange('cost', text)}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Calculate" onPress={calculate} />

      {result && (
        <View style={styles.result}>
          <Text>Profitability: ${result.profitability}</Text>
        </View>
      )}
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const isTablet = screenWidth >= 768;

const styles = StyleSheet.create({
  container: {flex: 1, padding: isTablet ? 40 : 20},
  title: {fontSize: isTablet ? 32 : 24},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  error: {color: 'red', marginBottom: 10},
  result: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});

export default CalculatorScreen;
