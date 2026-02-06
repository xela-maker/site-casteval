import { useParams } from 'react-router-dom';
import { CasaFormBase } from '@/components/admin/CasaFormBase';

export default function CasaForm() {
  const { id } = useParams();
  
  return <CasaFormBase contextType="general" casaId={id} />;
}
