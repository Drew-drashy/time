import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import axiosInstance from '../api/axiosInstance';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const ProjectsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [date, setDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
    fetchProjects();
  }, [search, status, date, page]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/api/projects', {
        params: {
          search,
          status,
          date,
          page,
          limit: 10
        }
      });
      setProjects(res.data.projects);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.log('Error:', error.response?.data || error.message);
      alert('Failed to load projects');
    }
    setLoading(false);
  };

  

  return (
    <View className="flex-1 bg-white p-4 ">
      <Text className="text-2xl font-bold text-blue-600 text-center mb-4 pt-8">Your Projects</Text>

      <TextInput
        placeholder="Search by name"
        value={search}
        onChangeText={setSearch}
        className="border border-gray-300 p-2 rounded mb-2"
      />

      <View className="flex-row justify-between mb-2">
        <TouchableOpacity onPress={() => setStatus('ongoing')} className="bg-blue-200 px-3 py-1 rounded">
          <Text>Ongoing</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setStatus('completed')} className="bg-gray-200 px-3 py-1 rounded">
          <Text>Completed</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => setStatus('all')} className="bg-yellow-200 px-3 py-1 rounded">
          <Text>All</Text>
        </TouchableOpacity> */}
      </View>

      <TextInput
        placeholder="Filter by deadline (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        className="border border-gray-300 p-2 rounded mb-4"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" />
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View className="bg-gray-100 p-4 rounded mb-4">
              <Text className="text-lg font-bold mb-1">{item.name}</Text>
              <Text className="text-gray-700 mb-1">{item.description || 'No description'}</Text>
              <Text className="text-sm text-gray-500 mb-2">Deadline: {item.deadline || 'None'}</Text>

              {user.role === 'admin' && item.assignedEmployees?.length > 0 && (
                <>
                  <Text className="text-sm font-semibold mb-1">Employees:</Text>
                  {item.assignedEmployees.map((emp) => (
                    <TouchableOpacity key={emp._id} onPress={() => navigation.navigate('EmployeeDetails', { employeeId: emp._id, projectId:item._id })}>
                      <Text className="text-blue-600 underline text-sm">{emp.name || emp.email}</Text>
                    </TouchableOpacity>
                  ))}
                </>
              )}

                {user.role !== 'admin' && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ProjectDetails', { projectId: item._id })}
                    className="bg-blue-500 p-2 mt-2 rounded"
                  >
                    <Text className="text-center text-white font-bold">View My Logs</Text>
                  </TouchableOpacity>
                )}
                {/* {
                  user.role=='admin' && (
                    <TouchableOpacity
                    onPress={()=>navigation.navigate('EmployeeDetails',)} 
                    className='bg-blue-500 p-2 mt-2 rounded'
                    >
                      <Text className="text-center text-white font-bold">View Assigned Employee</Text>
                      </TouchableOpacity>

                  )
                } */}
            </View>
          )}
        />
      )}

      <View className="flex-row justify-between mt-4">
        <TouchableOpacity disabled={page <= 1} onPress={() => setPage((p) => p - 1)}>
          <Text className="text-blue-600 font-bold">{'<'} Prev</Text>
        </TouchableOpacity>
        <Text>Page {page} of {totalPages}</Text>
        <TouchableOpacity disabled={page >= totalPages} onPress={() => setPage((p) => p + 1)}>
          <Text className="text-blue-600 font-bold">Next {'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProjectsScreen;
