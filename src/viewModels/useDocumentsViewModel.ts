import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';

export interface LegalDocument {
  id: string;
  name: string;
  document_type: string;
  description: string;
  issuing_entity: string;
  issue_date: string | null;
  expiry_date: string | null;
  file_url: string | null;
  is_active: boolean;
}

export function useDocumentsViewModel() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('todos');

  useEffect(() => {
    setLoading(true);
    supabase
      .from('legal_documents')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data) setDocuments(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error('Error fetching documents:', err);
        setLoading(false);
      });
  }, []);

  const typeKeys = useMemo(() => {
    return ['todos', ...new Set(documents.map((d) => d.document_type))];
  }, [documents]);

  const isExpired = (expiry: string | null): boolean => {
    if (!expiry) return false;
    return new Date(expiry + 'T00:00:00') < new Date();
  };

  const expiresShortly = (expiry: string | null): boolean => {
    if (!expiry) return false;
    const diff = new Date(expiry + 'T00:00:00').getTime() - Date.now();
    return diff > 0 && diff < 1000 * 60 * 60 * 24 * 90; // 90 days
  };

  const filteredDocuments = useMemo(() => {
    return filter === 'todos'
      ? documents
      : documents.filter((d) => d.document_type === filter);
  }, [documents, filter]);

  const getDocumentUrl = (path: string | null): string | null => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const { data } = supabase.storage
      .from('digital-assets-statics-documents')
      .getPublicUrl(path);
    return data?.publicUrl || null;
  };

  const stats = useMemo(() => {
    const totalDocs = documents.length;
    const validDocs = documents.filter((d) => !isExpired(d.expiry_date)).length;
    const withFile = documents.filter((d) => d.file_url).length;
    return { totalDocs, validDocs, withFile };
  }, [documents]);

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '—';
    return new Date(dateString + 'T00:00:00').toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return {
    documents: filteredDocuments,
    loading,
    filter,
    setFilter,
    typeKeys,
    stats,
    isExpired,
    expiresShortly,
    getDocumentUrl,
    formatDate,
  };
}
