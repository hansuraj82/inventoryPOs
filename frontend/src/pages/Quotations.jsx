import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    FaSearch, FaTimes, FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight,
    FaPrint, FaDownload, FaEdit, FaTrash, FaFileAlt, FaSpinner, FaSave,
    FaSyncAlt, FaEye
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { quotationAPI } from '../services/api';
import { useAuthStore } from '../store/store';
import { formatCurrency, formatDate } from '../utils/helpers';
import { downloadQuotation, printQuotation } from '../utils/quotationPdf';

const PAGE_SIZE = 15;
const STATUSES = ['draft', 'sent', 'accepted', 'rejected', 'expired'];

const money = (value) => {
    const number = Number(value);
    if (Number.isFinite(number)) {
        try { return formatCurrency(number); } catch { return `₹${number.toFixed(2)}`; }
    }
    return '₹0.00';
};

const dateText = (value) => {
    if (!value) return '—';
    try { return formatDate(value); } catch { return new Date(value).toLocaleDateString('en-IN'); }
};

const getId = (quotation) => quotation?._id || quotation?.id;
const getCustomer = (quotation) => quotation?.customer || {};
const getCustomerName = (quotation) =>
    getCustomer(quotation).name || quotation?.customerName || 'Walk-in customer';
const getQuotationNumber = (quotation) =>
    quotation?.quotationNumber || quotation?.quoteNumber || `QT-${String(getId(quotation) || '').slice(-6).toUpperCase()}`;

const unwrapQuotation = (response) => {
    const payload = response?.data || {};
    return payload.data?.quotation || payload.quotation || payload.data || payload;
};

const getBusinessDetails = (user) => ({
    gstin: user?.businessDetails?.gstin || '',
    pan: user?.businessDetails?.pan || '',
    address: user?.businessDetails?.businessAddress || '',
    phone: user?.businessDetails?.businessPhone || '',
    email: user?.businessDetails?.businessEmail || '',
    upiId: user?.businessDetails?.upiId || '',
    bankDetails: user?.businessDetails?.bankName && user?.businessDetails?.accountNumber
        ? `${user.businessDetails.bankName}, Acc: ${user.businessDetails.accountNumber}, IFSC: ${user.businessDetails.ifscCode || 'N/A'}`
        : '',
    bankName: user?.businessDetails?.bankName,
    accountNumber: user?.businessDetails?.accountNumber,
    ifscCode: user?.businessDetails?.ifscCode,
    holderName: (user?.name || '').toUpperCase(),
});

const normalizeItem = (item = {}) => ({
    ...item,
    productName: item.productName || item.name || item.product?.name || 'Item',
    quantity: Number(item.quantity) || 1,
    price: Number(item.price ?? item.unitPrice) || 0,
    gstRate: Number(item.gstRate) || 0,
    discount: item.discount || { type: 'fixed', value: 0 },
});

export default function Quotations() {
    const { user } = useAuthStore();
    const [quotations, setQuotations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [committedQuery, setCommittedQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [expandedId, setExpandedId] = useState(null);
    const [editingQuotation, setEditingQuotation] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [statusUpdatingId, setStatusUpdatingId] = useState(null);
    const requestId = useRef(0);

    useEffect(() => { document.title = 'Quotations - Dukanbill'; }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            setCommittedQuery(searchQuery.trim());
        }, 350);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const loadQuotations = useCallback(async () => {
        const id = ++requestId.current;
        setIsLoading(true);
        if (committedQuery) setIsSearching(true);
        try {
            const response = committedQuery
                ? await quotationAPI.search(committedQuery, currentPage, PAGE_SIZE)
                : await quotationAPI.getAll(currentPage, PAGE_SIZE);
            if (id !== requestId.current) return;

            const payload = response?.data || {};
            const list = Array.isArray(payload.data)
                ? payload.data
                : Array.isArray(payload.quotations)
                    ? payload.quotations
                    : Array.isArray(payload.data?.quotations)
                        ? payload.data.quotations
                        : [];
            setQuotations(list);
            setTotalCount(Number(payload.totalCount ?? payload.pagination?.totalCount ?? payload.total) || list.length);
            setTotalPages(Math.max(1, Number(payload.totalPages ?? payload.pagination?.totalPages) || 1));
        } catch (error) {
            if (id !== requestId.current) return;
            console.error('Failed to load quotations:', error);
            toast.error(error.response?.data?.message || 'Failed to load quotations');
            setQuotations([]);
            setTotalCount(0);
            setTotalPages(1);
        } finally {
            if (id === requestId.current) {
                setIsLoading(false);
                setIsSearching(false);
            }
        }
    }, [committedQuery, currentPage]);

    useEffect(() => {
        loadQuotations();
        return () => { requestId.current += 1; };
    }, [loadQuotations]);

    const goToPage = (page) => {
        const nextPage = Math.min(Math.max(1, page), totalPages);
        if (nextPage !== currentPage) {
            setCurrentPage(nextPage);
            setExpandedId(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setCommittedQuery('');
        setCurrentPage(1);
    };

    const getTotal = (quotation) => {
        const total = Number(quotation?.totalAmount ?? quotation?.grandTotal ?? quotation?.total);
        if (Number.isFinite(total)) return total;
        return (quotation?.items || []).reduce((sum, item) =>
            sum + (Number(item.quantity) || 0) * (Number(item.price ?? item.unitPrice) || 0), 0);
    };

    const makePDFData = (quotation) => ({
        ...quotation,
        quotationNumber: getQuotationNumber(quotation),
        createdAt: quotation.createdAt || quotation.quotationDate || quotation.date || new Date().toISOString(),
        validUntil: quotation.validUntil || quotation.validityDate || null,
        customer: {
            ...getCustomer(quotation),
            name: getCustomerName(quotation),
            mobile: getCustomer(quotation).mobile || quotation.customerMobile || quotation.mobile || '',
            address: getCustomer(quotation).address || quotation.customerAddress || '',
            email: getCustomer(quotation).email || quotation.customerEmail || '',
        },
        items: (quotation.items || []).map(normalizeItem),
        totalAmount: getTotal(quotation),
    });

    const handleDownload = async (quotation) => {
        try {
            await downloadQuotation(makePDFData(quotation), user?.shopName || 'Business', getBusinessDetails(user));
            toast.success('Quotation downloaded');
        } catch (error) {
            console.error('Quotation download failed:', error);
            toast.error('Could not download quotation PDF');
        }
    };

    const handlePrint = async (quotation) => {
        try {
            await printQuotation(makePDFData(quotation), user?.shopName || 'Business', getBusinessDetails(user));
            toast.success('Quotation opened for printing');
        } catch (error) {
            console.error('Quotation print failed:', error);
            toast.error('Could not print quotation');
        }
    };

    const handleStatusChange = async (quotation, status) => {
        const id = getId(quotation);
        if (!id || !STATUSES.includes(status) || status === quotation.status) return;
        setStatusUpdatingId(id);
        try {
            const response = await quotationAPI.updateStatus(id, status);
            const updated = unwrapQuotation(response);
            setQuotations((current) => current.map((item) =>
                getId(item) === id ? { ...item, ...(updated && typeof updated === 'object' ? updated : {}), status } : item));
            if (editingQuotation && getId(editingQuotation) === id) {
                setEditingQuotation((current) => ({ ...current, status }));
            }
            toast.success(`Quotation marked ${status}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update quotation status');
        } finally {
            setStatusUpdatingId(null);
        }
    };

    const openEdit = (quotation) => {
        setEditingQuotation({
            ...quotation,
            customer: {
                ...getCustomer(quotation),
                name: getCustomerName(quotation),
                mobile: getCustomer(quotation).mobile || quotation.customerMobile || quotation.mobile || '',
                address: getCustomer(quotation).address || quotation.customerAddress || '',
                email: getCustomer(quotation).email || quotation.customerEmail || '',
            },
            items: (quotation.items || []).map(normalizeItem),
            validUntil: (quotation.validUntil || quotation.validityDate || '').toString().slice(0, 10),
            notes: quotation.notes || '',
            status: quotation.status || 'draft',
        });
    };

    const updateEditItem = (index, key, value) => {
        setEditingQuotation((current) => ({
            ...current,
            items: current.items.map((item, itemIndex) => itemIndex === index
                ? { ...item, [key]: value === '' ? '' : key === 'productName' ? value : Number(value) }
                : item),
        }));
    };

    const handleSaveEdit = async (event) => {
        event.preventDefault();
        if (!editingQuotation) return;
        const id = getId(editingQuotation);
        if (!id) {
            toast.error('Quotation ID is missing');
            return;
        }
        if (!editingQuotation.customer?.name?.trim()) {
            toast.error('Customer name is required');
            return;
        }
        if (!editingQuotation.items?.length) {
            toast.error('Quotation must have at least one item');
            return;
        }
        if (editingQuotation.items.some((item) => !item.productName?.trim() || Number(item.quantity) <= 0 || Number(item.price) < 0)) {
            toast.error('Please check item names, quantities and prices');
            return;
        }

        const subtotal = editingQuotation.items.reduce((sum, item) =>
            sum + (Number(item.quantity) || 0) * (Number(item.price) || 0), 0);
        const payload = {
            ...editingQuotation,
            customer: { ...editingQuotation.customer },
            items: editingQuotation.items.map((item) => ({
                ...item,
                quantity: Number(item.quantity),
                price: Number(item.price),
                productName: item.productName.trim(),
            })),
            // Recalculate the line-item subtotal after quantity/price edits.
            // If your backend calculates GST/discounts, adjust this field to its schema.
            totalAmount: subtotal,
            validUntil: editingQuotation.validUntil || null,
            notes: editingQuotation.notes || '',
        };

        setIsSaving(true);
        try {
            const response = await quotationAPI.update(id, payload);
            const updated = unwrapQuotation(response);
            setQuotations((current) => current.map((item) =>
                getId(item) === id ? { ...item, ...(updated && typeof updated === 'object' ? updated : payload), _id: item._id || id } : item));
            setEditingQuotation(null);
            toast.success('Quotation updated successfully');
            await loadQuotations();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update quotation');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (quotation) => {
        const id = getId(quotation);
        if (!id) return toast.error('Quotation ID is missing');
        const confirmed = window.confirm(`Delete quotation ${getQuotationNumber(quotation)}? This action cannot be undone.`);
        if (!confirmed) return;

        setDeletingId(id);
        try {
            await quotationAPI.delete(id);
            setQuotations((current) => current.filter((item) => getId(item) !== id));
            setTotalCount((count) => Math.max(0, count - 1));
            if (expandedId === id) setExpandedId(null);
            toast.success('Quotation deleted');
            if (quotations.length === 1 && currentPage > 1) setCurrentPage((page) => page - 1);
            else await loadQuotations();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete quotation');
        } finally {
            setDeletingId(null);
        }
    };

    const statusClass = (status) => {
        const styles = {
            draft: 'bg-slate-100 text-slate-700',
            sent: 'bg-blue-100 text-blue-700',
            accepted: 'bg-emerald-100 text-emerald-700',
            rejected: 'bg-rose-100 text-rose-700',
            expired: 'bg-amber-100 text-amber-800',
        };
        return styles[String(status || 'draft').toLowerCase()] || 'bg-slate-100 text-slate-700';
    };

    return (
        <Layout>
            <div className="min-h-screen bg-slate-50/70 p-3 sm:p-5 lg:p-7">
                <div className="mx-auto max-w-7xl space-y-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
                                <FaFileAlt /> Sales documents
                            </div>
                            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Quotations</h1>
                            <p className="mt-1 text-sm text-slate-500">Create, review, update and manage customer quotations.</p>
                        </div>
                        <button
                            type="button"
                            onClick={loadQuotations}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
                        >
                            <FaSyncAlt className={isLoading ? 'animate-spin' : ''} /> Refresh
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total results</p>
                            <p className="mt-2 text-2xl font-bold text-slate-900">{totalCount}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">On this page</p>
                            <p className="mt-2 text-2xl font-bold text-slate-900">{quotations.length}</p>
                        </div>
                        <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-1">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Accepted on this page</p>
                            <p className="mt-2 text-2xl font-bold text-emerald-600">{quotations.filter((item) => item.status === 'accepted').length}</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                        <div className="relative">
                            <FaSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value.slice(0, 100))}
                                placeholder="Search quotation number, customer name or mobile..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                            />
                            {searchQuery && (
                                <button type="button" onClick={clearSearch} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                                    <FaTimes />
                                </button>
                            )}
                            {isSearching && <FaSpinner className="absolute right-10 top-1/2 -translate-y-1/2 animate-spin text-indigo-500" />}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full min-w-[900px] text-left text-sm">
                                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                    <tr>
                                        <th className="px-5 py-4 font-semibold">Quotation</th>
                                        <th className="px-5 py-4 font-semibold">Customer</th>
                                        <th className="px-5 py-4 font-semibold">Date</th>
                                        <th className="px-5 py-4 font-semibold">Valid until</th>
                                        <th className="px-5 py-4 text-right font-semibold">Amount</th>
                                        <th className="px-5 py-4 font-semibold">Status</th>
                                        <th className="px-5 py-4 text-right font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {isLoading ? (
                                        <tr><td colSpan="7" className="px-5 py-16 text-center text-slate-500"><FaSpinner className="mx-auto mb-3 animate-spin text-xl text-indigo-500" />Loading quotations…</td></tr>
                                    ) : quotations.length === 0 ? (
                                        <tr><td colSpan="7" className="px-5 py-16 text-center"><FaFileAlt className="mx-auto mb-3 text-3xl text-slate-300" /><p className="font-semibold text-slate-700">No quotations found</p><p className="mt-1 text-sm text-slate-500">{committedQuery ? 'Try another search term.' : 'Quotations you create from POS will appear here.'}</p></td></tr>
                                    ) : quotations.map((quotation) => {
                                        const id = getId(quotation);
                                        return (
                                            <React.Fragment key={id || getQuotationNumber(quotation)}>
                                                <tr className="transition hover:bg-slate-50/70">
                                                    <td className="px-5 py-4">
                                                        <button type="button" onClick={() => setExpandedId(expandedId === id ? null : id)} className="flex items-center gap-2 text-left font-bold text-indigo-700 hover:text-indigo-900">
                                                            {expandedId === id ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                                                            {getQuotationNumber(quotation)}
                                                        </button>

                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <p className="font-semibold text-slate-800">{getCustomerName(quotation)}</p>
                                                        <p className="mt-1 text-xs text-slate-500">{getCustomer(quotation).mobile || quotation.customerMobile || quotation.mobile || 'No mobile'}</p>
                                                    </td>
                                                    <td className="px-5 py-4 whitespace-nowrap text-slate-600">{dateText(quotation.createdAt || quotation.quotationDate || quotation.date)}</td>
                                                    <td className="px-5 py-4 whitespace-nowrap text-slate-600">{dateText(quotation.validUntil || quotation.validityDate)}</td>
                                                    <td className="px-5 py-4 text-right font-bold tabular-nums text-slate-900">{money(getTotal(quotation))}</td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${statusClass(quotation.status)}`}>{quotation.status || 'draft'}</span>
                                                            {statusUpdatingId === id && <FaSpinner className="animate-spin text-indigo-500" />}
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex justify-end gap-1">
                                                            <button title="View details" onClick={() => setExpandedId(expandedId === id ? null : id)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"><FaEye /></button>
                                                            <button title="Edit quotation" onClick={() => openEdit(quotation)} className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"><FaEdit /></button>
                                                            <button title="Print quotation" onClick={() => handlePrint(quotation)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"><FaPrint /></button>
                                                            <button title="Download PDF" onClick={() => handleDownload(quotation)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-emerald-700"><FaDownload /></button>
                                                            <button title="Delete quotation" disabled={deletingId === id} onClick={() => handleDelete(quotation)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 disabled:opacity-50">{deletingId === id ? <FaSpinner className="animate-spin" /> : <FaTrash />}</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {expandedId === id && (
                                                    <tr className="bg-slate-50/80">
                                                        <td colSpan="7" className="px-5 py-5">
                                                            <QuotationDetails
                                                                quotation={quotation}
                                                                statusClass={statusClass}
                                                                onStatusChange={(status) => handleStatusChange(quotation, status)}
                                                                onEdit={() => openEdit(quotation)}
                                                                onPrint={() => handlePrint(quotation)}
                                                                onDownload={() => handleDownload(quotation)}
                                                                statusUpdating={statusUpdatingId === id}
                                                            />
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="divide-y divide-slate-100 md:hidden">
                            {isLoading ? (
                                <div className="p-12 text-center text-slate-500"><FaSpinner className="mx-auto mb-3 animate-spin text-xl text-indigo-500" />Loading quotations…</div>
                            ) : quotations.length === 0 ? (
                                <div className="p-10 text-center"><FaFileAlt className="mx-auto mb-3 text-3xl text-slate-300" /><p className="font-semibold text-slate-700">No quotations found</p><p className="mt-1 text-sm text-slate-500">{committedQuery ? 'Try another search term.' : 'Quotations created from POS appear here.'}</p></div>
                            ) : quotations.map((quotation) => {
                                const id = getId(quotation);
                                return (
                                    <div key={id || getQuotationNumber(quotation)} className="p-4">
                                        <button type="button" onClick={() => setExpandedId(expandedId === id ? null : id)} className="flex w-full items-start justify-between gap-3 text-left">
                                            <div className="min-w-0">
                                                <p className="truncate font-bold text-indigo-700">{getQuotationNumber(quotation)}</p>
                                                <p className="mt-1 truncate font-semibold text-slate-800">{getCustomerName(quotation)}</p>
                                                <p className="mt-1 text-xs text-slate-500">{dateText(quotation.createdAt || quotation.quotationDate || quotation.date)} · Valid to {dateText(quotation.validUntil || quotation.validityDate)}</p>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <p className="font-bold text-slate-900">{money(getTotal(quotation))}</p>
                                                <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ${statusClass(quotation.status)}`}>{quotation.status || 'draft'}</span>
                                            </div>
                                        </button>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <button onClick={() => openEdit(quotation)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"><FaEdit /> Edit</button>
                                            <button onClick={() => handlePrint(quotation)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"><FaPrint /> Print</button>
                                            <button onClick={() => handleDownload(quotation)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"><FaDownload /> PDF</button>
                                            <button disabled={deletingId === id} onClick={() => handleDelete(quotation)} className="inline-flex items-center gap-2 rounded-lg border border-rose-100 px-3 py-2 text-xs font-semibold text-rose-600 disabled:opacity-50"><FaTrash /> Delete</button>
                                        </div>
                                        {expandedId === id && <div className="mt-4 border-t border-slate-100 pt-4"><QuotationDetails quotation={quotation} statusClass={statusClass} onStatusChange={(status) => handleStatusChange(quotation, status)} onEdit={() => openEdit(quotation)} onPrint={() => handlePrint(quotation)} onDownload={() => handleDownload(quotation)} statusUpdating={statusUpdatingId === id} /></div>}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-slate-500">
                                Showing <span className="font-semibold text-slate-700">{totalCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}</span>–<span className="font-semibold text-slate-700">{Math.min(currentPage * PAGE_SIZE, totalCount)}</span> of <span className="font-semibold text-slate-700">{totalCount}</span>
                            </p>
                            <div className="flex items-center justify-between gap-2 sm:justify-end">
                                <button type="button" disabled={currentPage <= 1 || isLoading} onClick={() => goToPage(currentPage - 1)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><FaChevronLeft /> Previous</button>
                                <span className="min-w-[100px] text-center text-sm font-semibold text-slate-700">Page {currentPage} of {totalPages}</span>
                                <button type="button" disabled={currentPage >= totalPages || isLoading} onClick={() => goToPage(currentPage + 1)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Next <FaChevronRight /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {editingQuotation && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSaving) setEditingQuotation(null); }}>
                    <div className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Edit quotation</h2>
                                <p className="mt-0.5 text-sm text-slate-500">{getQuotationNumber(editingQuotation)}</p>
                            </div>
                            <button type="button" onClick={() => setEditingQuotation(null)} disabled={isSaving} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><FaTimes /></button>
                        </div>
                        <form onSubmit={handleSaveEdit} className="flex min-h-0 flex-1 flex-col">
                            <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
                                <section>
                                    <h3 className="mb-3 text-sm font-bold text-slate-800">Customer details</h3>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <Field label="Customer name" required value={editingQuotation.customer?.name || ''} onChange={(value) => setEditingQuotation((current) => ({ ...current, customer: { ...current.customer, name: value } }))} />
                                        <Field label="Mobile number" value={editingQuotation.customer?.mobile || ''} onChange={(value) => setEditingQuotation((current) => ({ ...current, customer: { ...current.customer, mobile: value } }))} />
                                        <Field label="Email" value={editingQuotation.customer?.email || ''} onChange={(value) => setEditingQuotation((current) => ({ ...current, customer: { ...current.customer, email: value } }))} />
                                        <Field label="Address" value={editingQuotation.customer?.address || ''} onChange={(value) => setEditingQuotation((current) => ({ ...current, customer: { ...current.customer, address: value } }))} />
                                    </div>
                                </section>

                                <section>
                                    <h3 className="mb-3 text-sm font-bold text-slate-800">Quotation settings</h3>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <label className="block text-sm">
                                            <span className="mb-1.5 block font-medium text-slate-600">Valid until</span>
                                            <input type="date" value={editingQuotation.validUntil || ''} onChange={(event) => setEditingQuotation((current) => ({ ...current, validUntil: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" />
                                        </label>
                                        <label className="block text-sm">
                                            <span className="mb-1.5 block font-medium text-slate-600">Status</span>
                                            <select value={editingQuotation.status || 'draft'} onChange={(event) => setEditingQuotation((current) => ({ ...current, status: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 capitalize outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50">
                                                {STATUSES.map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}
                                            </select>
                                        </label>
                                    </div>
                                    <label className="mt-3 block text-sm">
                                        <span className="mb-1.5 block font-medium text-slate-600">Notes / terms</span>
                                        <textarea rows="3" value={editingQuotation.notes || ''} onChange={(event) => setEditingQuotation((current) => ({ ...current, notes: event.target.value }))} className="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" placeholder="Payment terms, delivery notes, or additional information" />
                                    </label>
                                </section>

                                <section>
                                    <div className="mb-3 flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-slate-800">Items and pricing</h3>
                                        <span className="text-xs text-slate-500">{editingQuotation.items?.length || 0} item(s)</span>
                                    </div>
                                    <div className="space-y-3">
                                        {(editingQuotation.items || []).map((item, index) => (
                                            <div key={item._id || item.product?._id || index} className="rounded-xl border border-slate-200 p-3">
                                                <label className="mb-3 block text-sm">
                                                    <span className="mb-1 block text-xs font-medium text-slate-500">Item name</span>
                                                    <input value={item.productName || ''} onChange={(event) => updateEditItem(index, 'productName', event.target.value)} disabled className="w-full cursor-not-allowed rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-indigo-400" />
                                                </label>
                                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                                    <label className="text-sm">
                                                        <span className="mb-1 block text-xs font-medium text-slate-500">Quantity</span>
                                                        <input type="number" min="0.01" step="0.01" value={item.quantity} onChange={(event) => updateEditItem(index, 'quantity', event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-indigo-400" />
                                                    </label>
                                                    <label className="text-sm">
                                                        <span className="mb-1 block text-xs font-medium text-slate-500">Unit price (₹)</span>
                                                        <input type="number" min="0" step="0.01" value={item.price} onChange={(event) => updateEditItem(index, 'price', event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-indigo-400" />
                                                    </label>
                                                    <div className="col-span-2 flex items-end justify-between rounded-lg bg-slate-50 px-3 py-2 sm:col-span-1 sm:block">
                                                        <span className="text-xs font-medium text-slate-500">Line total</span>
                                                        <p className="mt-1 font-bold text-slate-900">{money((Number(item.quantity) || 0) * (Number(item.price) || 0))}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex items-center justify-between rounded-xl bg-indigo-50 px-4 py-3">
                                        <span className="text-sm font-semibold text-indigo-900">Items subtotal (before tax / discounts)</span>
                                        <span className="text-lg font-bold text-indigo-900">{money((editingQuotation.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0), 0))}</span>
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500">Editing item prices recalculates the basic subtotal. If your backend applies GST, discounts, or other charges separately, verify its total-calculation rules before saving.</p>
                                </section>
                            </div>
                            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                                <button type="button" disabled={isSaving} onClick={() => setEditingQuotation(null)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50">Cancel</button>
                                <button type="submit" disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
                                    {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />} {isSaving ? 'Saving…' : 'Save changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}

function Field({ label, value, onChange, required = false }) {
    return (
        <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-slate-600">{label}{required && <span className="ml-1 text-rose-500">*</span>}</span>
            <input required={required} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" />
        </label>
    );
}

function QuotationDetails({ quotation, statusClass, onStatusChange, onEdit, onPrint, onDownload, statusUpdating }) {
    const customer = getCustomer(quotation);
    const items = (quotation.items || []).map(normalizeItem);
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    return (
        <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Detail label="Customer" value={getCustomerName(quotation)} />
                <Detail label="Mobile" value={customer.mobile || quotation.customerMobile || quotation.mobile || '—'} />
                <Detail label="Email" value={customer.email || quotation.customerEmail || '—'} />
                <Detail label="Address" value={customer.address || quotation.customerAddress || '—'} />
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-100 px-4 py-3"><h4 className="text-sm font-bold text-slate-800">Quoted items</h4></div>
                {items.length ? (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <table className="w-full min-w-[650px] text-left border-collapse text-sm">
                            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-4 py-3.5">Item</th>
                                    <th className="px-3 py-3.5 text-right">Qty</th>
                                    <th className="px-3 py-3.5 text-right">HSN</th>
                                    <th className="px-4 py-3.5 text-right">Price</th>
                                    <th className="px-3 py-3.5 text-center">GST</th>
                                    <th className="px-3 py-3.5 text-right">Tax</th>
                                    <th className="px-3 py-3.5 text-right">Discount</th>
                                    <th className="px-4 py-3.5 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                                {items.map((item, index) => (
                                    <tr key={item._id || index} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-4 py-3.5 font-bold text-slate-900">
                                            {item.productName}
                                        </td>
                                        <td className="px-3 py-3.5 text-right font-semibold text-slate-700">
                                            {item.quantity}
                                        </td>
                                        <td className="px-3 py-3.5 text-right text-slate-400 font-mono text-xs">
                                            {item.hsnCode || '—'}
                                        </td>
                                        <td className="px-4 py-3.5 text-right text-slate-600 font-medium">
                                            {money(item.price)}
                                        </td>
                                        <td className="px-3 py-3.5 text-center">
                                            <span className="inline-block bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-md text-xs">
                                                {item.gstRate}%
                                            </span>
                                        </td>
                                        <td className="px-3 py-3.5 text-right font-semibold text-emerald-600">
                                            {money(item.taxAmount)}
                                        </td>
                                        <td className="px-3 py-3.5 text-right font-semibold text-rose-600">
                                             {item.discount?.amount > 0 ? `- ${formatCurrency(item.discount.amount)}` : '—'}
                                                        {item.discount?.type === "percentage" && item.discount?.value > 0 && ` (${item.discount.value}%)`}
                                        </td>
                                        <td className="px-4 py-3.5 text-right font-extrabold text-slate-900">
                                            {money(item.itemTotal)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            {quotation.saleDiscount.amount && <tfoot className="bg-slate-50/80 border-t border-slate-200">
                                <tr>
                                    <td colSpan="7" className="px-4 py-3.5 text-right font-bold text-slate-600 text-xs uppercase tracking-wider">
                                        Sale Discount
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-black text-red-600 text-base">
                                        {quotation.saleDiscount?.amount > 0 ? `- ${money(quotation.saleDiscount?.amount)}` : '—'}
                                        {quotation.saleDiscount?.type === "percentage" && quotation.saleDiscount?.value > 0 && ` (${quotation.saleDiscount?.value}%)`}
                                    </td>
                                </tr>
                            </tfoot>}
                            <tfoot className="bg-slate-50/80 border-t border-slate-200">
                                <tr>
                                    <td colSpan="7" className="px-4 py-3.5 text-right font-bold text-slate-600 text-xs uppercase tracking-wider">
                                        Total Amount
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-black text-indigo-600 text-base">
                                        {money(quotation.totalAmount)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                ) : <p className="p-4 text-sm text-slate-500">No item details are available.</p>}
            </div>
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="space-y-2 text-sm text-slate-600">
                    <p><span className="font-semibold text-slate-800">Notes:</span> {quotation.notes || 'No notes added.'}</p>
                    {quotation.terms && <p><span className="font-semibold text-slate-800">Terms:</span> {quotation.terms}</p>}
                    <p><span className="font-semibold text-slate-800">Validity:</span> {dateText(quotation.validUntil || quotation.validityDate)}</p>
                    <p><span className="font-semibold text-slate-800">GST bill:</span> {quotation.isGstBill ? 'Yes' : 'Not specified / no'}</p>
                </div>
                <div className="min-w-[220px] rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Quotation total</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{money(Number(quotation.totalAmount ?? quotation.grandTotal ?? quotation.total ?? subtotal))}</p>
                    <label className="mt-3 block text-xs font-semibold text-slate-500">Update status</label>
                    <select value={quotation.status || 'draft'} disabled={statusUpdating} onChange={(event) => onStatusChange(event.target.value)} className={`mt-1 w-full rounded-lg border-0 px-3 py-2 text-sm font-bold capitalize outline-none ring-1 ring-inset ring-slate-200 ${statusClass(quotation.status)}`}>
                        {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                    {statusUpdating && <p className="mt-1 text-xs text-slate-400"><FaSpinner className="mr-1 inline animate-spin" />Updating status…</p>}
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                <button onClick={onEdit} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"><FaEdit /> Edit quotation</button>
                <button onClick={onPrint} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"><FaPrint /> Print</button>
                <button onClick={onDownload} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"><FaDownload /> Download PDF</button>
            </div>
        </div>
    );
}

function Detail({ label, value }) {
    return <div className="min-w-0"><p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 break-words text-sm font-semibold text-slate-800">{value || '—'}</p></div>;
}
