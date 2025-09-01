<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Directory App</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6;
        }
    </style>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center">

    <div id="root" class="bg-white rounded-xl shadow-2xl p-8 max-w-xl w-full mx-4 my-8"></div>

    <script type="text/babel">
        const { useState, useEffect } = React;
        const { createRoot } = ReactDOM;

       
        const mockBackend = {
            fetchStudents: () => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        const students = [
                            { id: 1, name: 'Alice Johnson', major: 'Computer Science' },
                            { id: 2, name: 'Bob Williams', major: 'Mechanical Engineering' },
                            { id: 3, name: 'Charlie Brown', major: 'Business Administration' },
                            { id: 4, name: 'Diana Miller', major: 'Data Science' },
                            { id: 5, name: 'Ethan Davis', major: 'Electrical Engineering' }
                        ];
                        resolve({ ok: true, json: () => Promise.resolve(students) });
                    }, 1000); // Simulate network delay
                });
            }
        };

        const StudentDirectoryApp = () => {
            const [students, setStudents] = useState([]);
            const [loading, setLoading] = useState(true);
            const [error, setError] = useState(null);

            // The useEffect hook for fetching data
            useEffect(() => {
                const fetchStudentsData = async () => {
                    try {
                        // Simulate a fetch call to our mock backend
                        const response = await mockBackend.fetchStudents();

                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }

                        const data = await response.json();
                        setStudents(data);
                    } catch (e) {
                        setError(e.message);
                    } finally {
                        setLoading(false);
                    }
                };

                fetchStudentsData();
            }, []); // The empty dependency array ensures this effect runs only once on mount

            if (loading) {
                return (
                    <div class="flex flex-col items-center justify-center h-48">
                        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                        <p class="mt-4 text-gray-600">Loading student data...</p>
                    </div>
                );
            }

            if (error) {
                return (
                    <div class="text-center text-red-500 p-4 rounded-md bg-red-100">
                        <p>Error: {error}</p>
                        <p>Failed to fetch student data. Please check your network.</p>
                    </div>
                );
            }

            return (
                <div class="p-6">
                    <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">Student Directory</h1>
                    <ul class="space-y-4">
                        {students.length > 0 ? (
                            students.map(student => (
                                <li key={student.id} class="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 transition-transform transform hover:scale-105">
                                    <div class="flex items-center space-x-4">
                                        <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div class="flex-grow">
                                            <p class="font-medium text-gray-800">{student.name}</p>
                                            <p class="text-sm text-gray-500">{student.major}</p>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p class="text-center text-gray-500">No students found.</p>
                        )}
                    </ul>
                </div>
            );
        };

        const container = document.getElementById('root');
        const root = createRoot(container);
        root.render(<StudentDirectoryApp />);
    </script>
</body>
</html>
