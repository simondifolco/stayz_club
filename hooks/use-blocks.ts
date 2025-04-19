import { useState, useCallback, useEffect } from 'react';
import { Block, BlockItem, Link, HotelBlock, HotelLink } from '@/components/dashboard/links/types';
import { toast } from 'sonner';
import { useHotel } from '@/contexts/hotel-context';
import { createClient } from '@/utils/supabase/client';

export function useBlocks() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { selectedHotel } = useHotel();
  const supabase = createClient();

  // Load blocks when selected hotel changes
  useEffect(() => {
    let mounted = true;

    const loadBlocks = async () => {
      if (!selectedHotel) return;

      try {
        setLoading(true);
        setError(null);

        const { data: hotelBlocks, error: blocksError } = await supabase
          .from('hotel_blocks')
          .select(`
            id,
            title,
            description,
            is_active,
            sort_order,
            hotel_links (
              id,
              title,
              description,
              link_type,
              url,
              pdf_url,
              is_active,
              sort_order
            )
          `)
          .eq('hotel_id', selectedHotel.id)
          .order('sort_order', { ascending: true });

        if (blocksError) throw blocksError;

        if (mounted) {
          const formattedBlocks: Block[] = hotelBlocks.map(block => ({
            id: block.id,
            title: block.title,
            description: block.description,
            is_active: block.is_active,
            sort_order: block.sort_order,
            links: block.hotel_links.map(link => ({
              id: link.id,
              title: link.title,
              description: link.description,
              type: link.link_type,
              url: link.url || undefined,
              pdfUrl: link.pdf_url || undefined,
              is_active: link.is_active,
              sort_order: link.sort_order
            }))
          }));

          setBlocks(formattedBlocks);
        }
      } catch (err) {
        console.error('Error loading blocks:', err);
        const error = err instanceof Error ? err : new Error('Failed to load blocks');
        setError(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadBlocks();

    return () => {
      mounted = false;
    };
  }, [selectedHotel]);

  const addBlock = useCallback(async (title: string) => {
    if (!selectedHotel) throw new Error('No hotel selected');

    try {
      const { data: block, error: blockError } = await supabase
        .from('hotel_blocks')
        .insert([{
          hotel_id: selectedHotel.id,
          title,
          is_active: true,
          sort_order: blocks.length
        }])
        .select()
        .single();

      if (blockError) throw blockError;

      const newBlock: Block = {
        id: block.id,
        title: block.title,
        is_active: block.is_active,
        sort_order: block.sort_order,
        links: []
      };

      setBlocks(prev => [...prev, newBlock]);
      return newBlock;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add block');
      setError(error);
      throw error;
    }
  }, [selectedHotel, blocks.length]);

  const editBlock = useCallback(async (blockId: string, title: string) => {
    if (!selectedHotel) throw new Error('No hotel selected');

    try {
      const { error: blockError } = await supabase
        .from('hotel_blocks')
        .update({ title })
        .eq('id', blockId)
        .eq('hotel_id', selectedHotel.id);

      if (blockError) throw blockError;

      setBlocks(prev => prev.map(block => 
        block.id === blockId 
          ? { ...block, title }
          : block
      ));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to edit block');
      setError(error);
      throw error;
    }
  }, [selectedHotel]);

  const deleteBlock = useCallback(async (blockId: string) => {
    if (!selectedHotel) throw new Error('No hotel selected');

    try {
      const { error: blockError } = await supabase
        .from('hotel_blocks')
        .delete()
        .eq('id', blockId)
        .eq('hotel_id', selectedHotel.id);

      if (blockError) throw blockError;

      setBlocks(prev => prev.filter(block => block.id !== blockId));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete block');
      setError(error);
      throw error;
    }
  }, [selectedHotel]);

  const addLink = useCallback(async (
    blockId: string,
    title: string,
    type: 'external' | 'pdf',
    url?: string,
    pdfUrl?: string
  ) => {
    if (!selectedHotel) throw new Error('No hotel selected');

    try {
      const block = blocks.find(b => b.id === blockId);
      if (!block) throw new Error('Block not found');

      const { data: link, error: linkError } = await supabase
        .from('hotel_links')
        .insert([{
          hotel_id: selectedHotel.id,
          block_id: blockId,
          title,
          link_type: type,
          url: type === 'external' ? url : null,
          pdf_url: type === 'pdf' ? pdfUrl : null,
          is_active: true,
          sort_order: block.links.length
        }])
        .select()
        .single();

      if (linkError) throw linkError;

      const newLink: Link = {
        id: link.id,
        title: link.title,
        type: link.link_type,
        url: link.url || undefined,
        pdfUrl: link.pdf_url || undefined,
        is_active: link.is_active,
        sort_order: link.sort_order
      };

      setBlocks(prev => prev.map(b => 
        b.id === blockId 
          ? { ...b, links: [...b.links, newLink] }
          : b
      ));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add link');
      setError(error);
      throw error;
    }
  }, [selectedHotel, blocks]);

  const editLink = useCallback(async (
    linkId: string,
    blockId: string,
    title: string,
    type: 'external' | 'pdf',
    url?: string,
    pdfUrl?: string
  ) => {
    if (!selectedHotel) throw new Error('No hotel selected');

    try {
      const { error: linkError } = await supabase
        .from('hotel_links')
        .update({
          title,
          link_type: type,
          url: type === 'external' ? url : null,
          pdf_url: type === 'pdf' ? pdfUrl : null
        })
        .eq('id', linkId)
        .eq('block_id', blockId)
        .eq('hotel_id', selectedHotel.id);

      if (linkError) throw linkError;

      setBlocks(prev => prev.map(block => 
        block.id === blockId 
          ? {
              ...block,
              links: block.links.map(link =>
                link.id === linkId
                  ? { ...link, title, type, url, pdfUrl }
                  : link
              )
            }
          : block
      ));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to edit link');
      setError(error);
      throw error;
    }
  }, [selectedHotel]);

  const deleteLink = useCallback(async (linkId: string) => {
    if (!selectedHotel) throw new Error('No hotel selected');

    try {
      const { error: linkError } = await supabase
        .from('hotel_links')
        .delete()
        .eq('id', linkId)
        .eq('hotel_id', selectedHotel.id);

      if (linkError) throw linkError;

      setBlocks(prev => prev.map(block => ({
        ...block,
        links: block.links.filter(link => link.id !== linkId)
      })));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete link');
      setError(error);
      throw error;
    }
  }, [selectedHotel]);

  const updateBlockSortOrder = useCallback(async (items: HotelBlock[]) => {
    if (!selectedHotel) throw new Error('No hotel selected');

    try {
      const updates = items.map(item => ({
        id: item.id,
        sort_order: item.sort_order
      }));

      const { error } = await supabase
        .from('hotel_blocks')
        .upsert(updates)
        .eq('hotel_id', selectedHotel.id);

      if (error) throw error;

      const sortedBlocks = items.map(item => {
        const block = blocks.find(b => b.id === item.id);
        return {
          ...block!,
          sort_order: item.sort_order
        };
      });
      setBlocks(sortedBlocks);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update block order');
      setError(error);
      throw error;
    }
  }, [selectedHotel, blocks]);

  const updateLinkSortOrder = useCallback(async (blockId: string, items: HotelLink[]) => {
    if (!selectedHotel) throw new Error('No hotel selected');

    try {
      const updates = items.map(item => ({
        id: item.id,
        sort_order: item.sort_order
      }));

      const { error } = await supabase
        .from('hotel_links')
        .upsert(updates)
        .eq('hotel_id', selectedHotel.id)
        .eq('block_id', blockId);

      if (error) throw error;

      setBlocks(prev => prev.map(block => 
        block.id === blockId
          ? {
              ...block,
              links: items.map(item => {
                const link = block.links.find(l => l.id === item.id);
                return {
                  ...link!,
                  sort_order: item.sort_order
                };
              })
            }
          : block
      ));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update link order');
      setError(error);
      throw error;
    }
  }, [selectedHotel]);

  return {
    blocks,
    loading,
    error,
    addBlock,
    editBlock,
    deleteBlock,
    addLink,
    editLink,
    deleteLink,
    updateBlockSortOrder,
    updateLinkSortOrder
  };
} 