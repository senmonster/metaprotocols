// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { useNavigate, useParams } from 'react-router-dom';
// import { fetchProtocol, updateProtocol } from '../api/protocol';
// import ProtocolForm from '../components/ProtocolForm';
// import { ProtocolItem, ProtocolNewForm } from '../types';

// const EditProtocol = () => {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();
//   const { id: tempId } = useParams();
//   const id = tempId ?? '';
//   const {
//     isLoading,
//     isError,
//     data: protocol,
//     error,
//   } = useQuery({
//     queryKey: ['protocol', id],
//     queryFn: () => fetchProtocol(id),
//   });
//   const updateProtocolMutation = useMutation({
//     mutationFn: updateProtocol,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['protocoles'] });
//       navigate('/');
//     },
//   });

//   if (isLoading) return <div>"loading..."</div>;
//   if (isError) return <div>`Error: ${error.message}`</div>;

//   const handleSubmit = (updatedProtocol: ProtocolNewForm) => {
//     updateProtocolMutation.mutate({ id, ...updatedProtocol });
//   };

//   return (
//     <div>
//       <ProtocolForm onSubmit={handleSubmit} initialValue={protocol} />
//     </div>
//   );
// };

// export default EditProtocol;

const EditProtocol = () => {
	return <div>EditProtocol</div>;
};

export default EditProtocol;
