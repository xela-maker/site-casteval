import { useParams } from 'react-router-dom';
import { CasaFormBase } from '@/components/admin/CasaFormBase';

export default function BusinessCasaForm() {
  const { id } = useParams();
  
  return <CasaFormBase contextType="business" casaId={id} />;
}
