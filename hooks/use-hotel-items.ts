import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useHotel } from '@/contexts/hotel-context';
import { Block, HotelItem, Link, LinkType } from '@/components/dashboard/links/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useHotelItems() {
  const supabase = createClient();
  const { selectedHotel } = useHotel();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const queryClient = useQueryClient();

  // Transform database items into UI blocks
  const transformItems = useCallback((items: HotelItem[]): Block[] => {
    const blockItems = items.filter(item => item.item_type === 'block');
    const linkItems = items.filter(item => item.item_type === 'link');

    return blockItems.map(block => ({
      id: block.id,
      title: block.title,
      description: block.description,
      is_active: block.is_active,
      sort_order: block.sort_order,
      links: linkItems
        .filter(link => link.parent_id === block.id)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        .map(link => ({
          id: link.id,
          title: link.title,
          description: link.description || '',
          type: link.link_type as "external" | "pdf",
          url: link.url || undefined,
          pdfUrl: link.pdf_url || undefined,
          is_active: link.is_active,
          sort_order: link.sort_order
        }))
    })).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }, []);

  // Fetch all items
  const fetchItems = useCallback(async () => {
    if (!selectedHotel?.id) {
      throw new Error('No selected hotel found');
    }

    const { data, error } = await supabase
      .from('hotel_items')
      .select('*')
      .eq('hotel_id', selectedHotel.id)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    return transformItems(data || []);
  }, [selectedHotel?.id, supabase, transformItems]);

  // Set up the query
  const { data: fetchedBlocks, isLoading, error } = useQuery({
    queryKey: ['hotel-items', selectedHotel?.id],
    queryFn: fetchItems,
    enabled: !!selectedHotel?.id,
  });

  // Update blocks when query data changes
  useEffect(() => {
    if (fetchedBlocks) {
      setBlocks(fetchedBlocks);
    }
  }, [fetchedBlocks]);

  // Update sort order
  const updateSortOrder = useCallback(async (items: HotelItem[]) => {
    if (!selectedHotel?.id) {
      throw new Error('No selected hotel found');
    }

    // Store current state for potential rollback
    const previousBlocks = [...blocks];

    try {
      // Optimistically update UI
      const updatedItems = transformItems(items);
      setBlocks(updatedItems);

      // Batch update all items with their new sort orders
      const { error } = await supabase
        .from('hotel_items')
        .upsert(
          items.map(item => ({
            ...item,
            hotel_id: selectedHotel.id,
            updated_at: new Date().toISOString()
          })),
          { onConflict: 'id' }
        );

      if (error) throw error;

      // Invalidate and refetch to ensure consistency
      await queryClient.invalidateQueries({ 
        queryKey: ['hotel-items', selectedHotel.id],
        exact: true 
      });
    } catch (error) {
      // Revert optimistic update on error
      setBlocks(previousBlocks);
      console.error('Failed to update sort order:', error);
      toast.error('Failed to update order');
      throw error;
    }
  }, [selectedHotel?.id, blocks, supabase, queryClient, transformItems]);

  // Add a block
  const addBlock = useCallback(async (title: string) => {
    if (!selectedHotel?.id) {
      throw new Error('No selected hotel found');
    }

    // Calculate new sort order
    const newSortOrder = blocks.length > 0 
      ? Math.max(...blocks.map(b => b.sort_order || 0)) + 1 
      : 0;

    // Create temporary ID
    const tempId = `temp-${Date.now()}`;

    // Optimistically update UI
    const newBlock: Block = {
      id: tempId,
      title,
      is_active: true,
      sort_order: newSortOrder,
      links: []
    };

    setBlocks(prev => [...prev, newBlock]);

    try {
      // Perform database operation
      const { data, error } = await supabase
        .from('hotel_items')
        .insert({
          hotel_id: selectedHotel.id,
          title,
          item_type: 'block',
          is_active: true,
          sort_order: newSortOrder
        })
        .select()
        .single();

      if (error) throw error;

      // Update the temporary ID with the real one
      setBlocks(prev => prev.map(block => 
        block.id === tempId ? { ...block, id: data.id } : block
      ));

      // Refetch to get the real ID and any other server-side changes
      await fetchItems();

      return data;
    } catch (error) {
      // Revert optimistic update on error
      setBlocks(prev => prev.filter(block => block.id !== tempId));
      toast.error('Failed to add block');
      throw error;
    }
  }, [selectedHotel?.id, blocks.length, supabase, fetchItems]);

  // Add a link
  const addLink = useCallback(async (
    blockId: string,
    title: string,
    type: LinkType,
    url?: string,
    pdfUrl?: string
  ) => {
    if (!selectedHotel?.id) {
      throw new Error('No selected hotel found');
    }

    // Validate inputs
    if (!blockId) throw new Error('Block ID is required');
    if (!title.trim()) throw new Error('Title is required');
    if (type === 'external' && !url?.trim()) throw new Error('URL is required for external links');
    if (type === 'pdf' && !pdfUrl?.trim()) throw new Error('PDF URL is required for PDF links');

    // Find the target block
    const targetBlock = blocks.find(b => b.id === blockId);
    if (!targetBlock) throw new Error('Block not found');

    // Calculate new sort order
    const newSortOrder = targetBlock.links.length > 0
      ? Math.max(...targetBlock.links.map(l => l.sort_order || 0)) + 1
      : 0;

    // Create temporary ID
    const tempId = `temp-${Date.now()}`;

    // Create new link
    const newLink: Link = {
      id: tempId,
      title,
      type,
      url: type === 'external' ? url : undefined,
      pdfUrl: type === 'pdf' ? pdfUrl : undefined,
      is_active: true,
      sort_order: newSortOrder
    };

    // Optimistically update UI
    setBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, links: [...block.links, newLink] }
        : block
    ));

    try {
      // Perform database operation
      const { data, error } = await supabase
        .from('hotel_items')
        .insert({
          hotel_id: selectedHotel.id,
          parent_id: blockId,
          title,
          item_type: 'link',
          link_type: type,
          url: type === 'external' ? url : null,
          pdf_url: type === 'pdf' ? pdfUrl : null,
          is_active: true,
          sort_order: newSortOrder
        })
        .select()
        .single();

      if (error) throw error;

      // Update the temporary ID with the real one
      setBlocks(prev => prev.map(block => 
        block.id === blockId 
          ? {
              ...block,
              links: block.links.map(link =>
                link.id === tempId ? { ...link, id: data.id } : link
              )
            }
          : block
      ));

      // Refetch to get the real ID and any other server-side changes
      await fetchItems();

      return data;
    } catch (error) {
      // Revert optimistic update on error
      setBlocks(prev => prev.map(block => 
        block.id === blockId 
          ? { ...block, links: block.links.filter(link => link.id !== tempId) }
          : block
      ));
      toast.error('Failed to add link');
      throw error;
    }
  }, [selectedHotel?.id, blocks, supabase, fetchItems]);

  // Delete a block
  const deleteBlock = useCallback(async (blockId: string) => {
    if (!selectedHotel?.id) {
      throw new Error('No selected hotel found');
    }

    // Store the block for potential rollback
    const blockToDelete = blocks.find(b => b.id === blockId);
    if (!blockToDelete) return;

    // Optimistically update UI
    setBlocks(prev => prev.filter(block => block.id !== blockId));

    try {
      const { error } = await supabase
        .from('hotel_items')
        .delete()
        .eq('id', blockId)
        .eq('hotel_id', selectedHotel.id);

      if (error) throw error;

      // Refetch to get the real ID and any other server-side changes
      await fetchItems();
    } catch (error) {
      // Revert optimistic update
      if (blockToDelete) {
        setBlocks(prev => [...prev, blockToDelete]);
      }
      toast.error('Failed to delete block');
      throw error;
    }
  }, [selectedHotel?.id, blocks, supabase, fetchItems]);

  // Delete a link
  const deleteLink = useCallback(async (linkId: string) => {
    if (!selectedHotel?.id) {
      throw new Error('No selected hotel found');
    }

    // Find the block containing the link
    const blockWithLink = blocks.find(block => 
      block.links.some(link => link.id === linkId)
    );
    
    if (!blockWithLink) return;

    // Store the link for potential rollback
    const linkToDelete = blockWithLink.links.find(l => l.id === linkId);
    if (!linkToDelete) return;

    // Optimistically update UI
    setBlocks(prev => prev.map(block => 
      block.id === blockWithLink.id
        ? { ...block, links: block.links.filter(link => link.id !== linkId) }
        : block
    ));

    try {
      const { error } = await supabase
        .from('hotel_items')
        .delete()
        .eq('id', linkId)
        .eq('hotel_id', selectedHotel.id);

      if (error) throw error;

      // Refetch to get the real ID and any other server-side changes
      await fetchItems();
    } catch (error) {
      // Revert optimistic update
      setBlocks(prev => prev.map(block => 
        block.id === blockWithLink.id
          ? { ...block, links: [...block.links, linkToDelete].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)) }
          : block
      ));
      toast.error('Failed to delete link');
      throw error;
    }
  }, [selectedHotel?.id, blocks, supabase, fetchItems]);

  // Edit a block
  const editBlock = useCallback(async (id: string, title: string) => {
    if (!selectedHotel?.id) {
      throw new Error('No selected hotel found');
    }

    // Store original block for potential rollback
    const originalBlock = blocks.find(b => b.id === id);
    if (!originalBlock) return;

    // Optimistically update UI
    setBlocks(prev => prev.map(block => 
      block.id === id
        ? { ...block, title }
        : block
    ));

    try {
      const { error } = await supabase
        .from('hotel_items')
        .update({ title })
        .eq('id', id)
        .eq('hotel_id', selectedHotel.id);

      if (error) throw error;

      // Refetch to get the real ID and any other server-side changes
      await fetchItems();
    } catch (error) {
      // Revert optimistic update
      setBlocks(prev => prev.map(block => 
        block.id === id ? originalBlock : block
      ));
      toast.error('Failed to edit block');
      throw error;
    }
  }, [selectedHotel?.id, blocks, supabase, fetchItems]);

  // Edit a link
  const editLink = useCallback(async (
    linkId: string,
    blockId: string,
    title: string,
    type: LinkType,
    url?: string,
    pdfUrl?: string
  ) => {
    if (!selectedHotel?.id) {
      throw new Error('No selected hotel found');
    }

    // Find the block containing the link
    const blockWithLink = blocks.find(block => block.id === blockId);
    if (!blockWithLink) return;

    // Store original link for potential rollback
    const originalLink = blockWithLink.links.find(l => l.id === linkId);
    if (!originalLink) return;

    // Create updated link
    const updatedLink: Link = {
      id: linkId,
      title,
      type,
      url: type === 'external' ? url : undefined,
      pdfUrl: type === 'pdf' ? pdfUrl : undefined,
      is_active: true,
      sort_order: originalLink.sort_order
    };

    // Optimistically update UI
    setBlocks(prev => prev.map(block => 
      block.id === blockId
        ? {
            ...block,
            links: block.links.map(link =>
              link.id === linkId ? updatedLink : link
            )
          }
        : block
    ));

    try {
      const { error } = await supabase
        .from('hotel_items')
        .update({
          parent_id: blockId,
          title,
          link_type: type,
          url: type === 'external' ? url : null,
          pdf_url: type === 'pdf' ? pdfUrl : null,
          is_active: true
        })
        .eq('id', linkId)
        .eq('hotel_id', selectedHotel.id)
        .eq('item_type', 'link');

      if (error) throw error;

      // Refetch to get the real ID and any other server-side changes
      await fetchItems();
    } catch (error) {
      // Revert optimistic update
      setBlocks(prev => prev.map(block => 
        block.id === blockId
          ? {
              ...block,
              links: block.links.map(link =>
                link.id === linkId ? originalLink : link
              )
            }
          : block
      ));
      toast.error('Failed to edit link');
      throw error;
    }
  }, [selectedHotel?.id, blocks, supabase, fetchItems]);

  return {
    blocks,
    loading: isLoading,
    error,
    addBlock,
    addLink,
    deleteBlock,
    deleteLink,
    editBlock,
    editLink,
    updateSortOrder
  };
} 