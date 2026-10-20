'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Calculator, CheckCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import {
  CUSTOMER_TYPES,
  customers,
  formatRWFFull,
} from '@/lib/mockData';
import { useConfig } from '@/context/ConfigContext';

interface VisitFormData {
  salesperson: string;
  dateOfVisit: string;
  customerName: string;
  area: string;
  customerCategory: string;
  visitOutcome: string;
  productCategory: string;
  quantity: number;
  unitPrice: number;
  paymentStatus: string;
  customerType: string;
  nextFollowUpDate: string;
  remarks: string;
}

interface SalesEntryFormProps {
  onSubmitSuccess: (entry: VisitFormData & { salesValue: number; id: string }) => void;
}

export default function SalesEntryForm({ onSubmitSuccess }: SalesEntryFormProps) {
  const { config } = useConfig();
  const salespeople = config.salespeople.map(i => i.label);
  const customerCategories = config.customerCategories.map(i => i.label);
  const visitOutcomes = config.visitOutcomes.map(i => i.label);
  const paymentStatuses = config.paymentStatuses.map(i => i.label);
  const productNames = config.productNames.map(i => i.label);

  const [salesValue, setSalesValue] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Derive today's date string once (YYYY-MM-DD) — stable across renders
  const todayStr = React.useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<VisitFormData>({
    defaultValues: {
      salesperson: '',
      dateOfVisit: todayStr,
      customerName: '',
      area: '',
      customerCategory: '',
      visitOutcome: '',
      productCategory: '',
      quantity: 0,
      unitPrice: 0,
      paymentStatus: '',
      customerType: '',
      nextFollowUpDate: '',
      remarks: '',
    },
  });

  const watchedQty = watch('quantity');
  const watchedPrice = watch('unitPrice');
  const watchedCustomer = watch('customerName');
  const watchedOutcome = watch('visitOutcome');

  useEffect(() => {
    const qty = Number(watchedQty) || 0;
    const price = Number(watchedPrice) || 0;
    setSalesValue(qty * price);
  }, [watchedQty, watchedPrice]);

  // Auto-fill area and category when customer is selected
  useEffect(() => {
    const found = customers.find((c) => c.name === watchedCustomer);
    if (found) {
      setValue('area', found.area);
      setValue('customerCategory', found.category);
    }
  }, [watchedCustomer, setValue]);

  // Backend integration point: POST /api/visit-logs
  const onSubmit = async (data: VisitFormData) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    const newEntry = {
      ...data,
      salesValue,
      id: `visit-${Date.now()}`,
    };
    onSubmitSuccess(newEntry);
    setSubmitSuccess(true);
    toast.success('Visit log saved successfully', {
      description: `${data.customerName} · ${formatRWFFull(salesValue)}`,
    });
    setTimeout(() => {
      setSubmitSuccess(false);
      reset({
        salesperson: data.salesperson,
        dateOfVisit: data.dateOfVisit,
        customerName: '',
        area: '',
        customerCategory: '',
        visitOutcome: '',
        productCategory: '',
        quantity: 0,
        unitPrice: 0,
        paymentStatus: '',
        customerType: '',
        nextFollowUpDate: '',
        remarks: '',
      });
      setSalesValue(0);
    }, 2000);
    setIsSubmitting(false);
  };

  const inputClass =
    'w-full bg-input border border-border rounded-lg px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors';
  const selectClass =
    'w-full bg-input border border-border rounded-lg px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors cursor-pointer';
  const labelClass = 'block text-sm font-semibold text-foreground mb-2 tracking-wide';
  const errorClass = 'text-xs text-negative mt-1.5';
  const helperClass = 'text-xs text-muted-foreground mt-1.5';

  const showOrderFields =
    watchedOutcome === 'Order Placed' || watchedOutcome === 'Follow-up Required';

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Section: Visit Details */}
        <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
          <div className="px-5 py-3 bg-muted/40 border-b border-border">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Visit Details
            </h3>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Salesperson */}
            <div>
              <label className={labelClass} htmlFor="salesperson">
                Salesperson <span className="text-negative">*</span>
              </label>
              <select
                id="salesperson"
                className={selectClass}
                {...register('salesperson', { required: 'Select a salesperson' })}
              >
                <option value="">Select rep...</option>
                {salespeople.map((sp) => (
                  <option key={`sp-${sp}`} value={sp}>
                    {sp}
                  </option>
                ))}
              </select>
              {errors.salesperson && (
                <p className={errorClass}>{errors.salesperson.message}</p>
              )}
            </div>

            {/* Date of Visit */}
            <div>
              <label className={labelClass} htmlFor="dateOfVisit">
                Date of Visit <span className="text-negative">*</span>
              </label>
              <input
                id="dateOfVisit"
                type="date"
                className={inputClass}
                max={todayStr}
                {...register('dateOfVisit', {
                  required: 'Date of visit is required',
                  validate: (value) => {
                    if (!value) return 'Date of visit is required';
                    const selected = new Date(value);
                    const today = new Date(todayStr);
                    if (selected > today) return 'Date cannot be in the future';
                    const ninetyDaysAgo = new Date(today);
                    ninetyDaysAgo.setDate(today.getDate() - 90);
                    if (selected < ninetyDaysAgo) return 'Date cannot be more than 90 days in the past';
                    return true;
                  },
                })}
              />
              {errors.dateOfVisit && (
                <p className={errorClass}>{errors.dateOfVisit.message}</p>
              )}
            </div>

            {/* Visit Outcome */}
            <div>
              <label className={labelClass} htmlFor="visitOutcome">
                Visit Outcome <span className="text-negative">*</span>
              </label>
              <select
                id="visitOutcome"
                className={selectClass}
                {...register('visitOutcome', { required: 'Select an outcome' })}
              >
                <option value="">Select outcome...</option>
                {visitOutcomes.map((o) => (
                  <option key={`outcome-${o}`} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              {errors.visitOutcome && (
                <p className={errorClass}>{errors.visitOutcome.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section: Customer */}
        <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
          <div className="px-5 py-3 bg-muted/40 border-b border-border">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Customer Information
            </h3>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Customer Name */}
            <div>
              <label className={labelClass} htmlFor="customerName">
                Customer Name <span className="text-negative">*</span>
              </label>
              <input
                id="customerName"
                type="text"
                list="customerNameList"
                className={inputClass}
                placeholder="Type or select customer name..."
                {...register('customerName', {
                  required: 'Customer name is required',
                  validate: (value) =>
                    value.trim().length >= 2 || 'Name must be at least 2 characters',
                  maxLength: { value: 100, message: 'Name must be 100 characters or fewer' },
                })}
              />
              <datalist id="customerNameList">
                {customers.map((c) => (
                  <option key={`cust-sel-${c.id}`} value={c.name} />
                ))}
              </datalist>
              <p className={helperClass}>
                Type a new name or select an existing customer to auto-fill area and category
              </p>
              {errors.customerName && (
                <p className={errorClass}>{errors.customerName.message}</p>
              )}
            </div>

            {/* Area */}
            <div>
              <label className={labelClass} htmlFor="area">
                Area / Location <span className="text-negative">*</span>
              </label>
              <input
                id="area"
                type="text"
                className={inputClass}
                placeholder="e.g. Kigali Centre"
                {...register('area', {
                  required: 'Area is required',
                  validate: (value) =>
                    value.trim().length >= 2 || 'Area must be at least 2 characters',
                  maxLength: { value: 100, message: 'Area must be 100 characters or fewer' },
                })}
              />
              {errors.area && (
                <p className={errorClass}>{errors.area.message}</p>
              )}
            </div>

            {/* Customer Category */}
            <div>
              <label className={labelClass} htmlFor="customerCategory">
                Customer Category <span className="text-negative">*</span>
              </label>
              <select
                id="customerCategory"
                className={selectClass}
                {...register('customerCategory', { required: 'Select a category' })}
              >
                <option value="">Select category...</option>
                {customerCategories.map((cat) => (
                  <option key={`cat-${cat}`} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.customerCategory && (
                <p className={errorClass}>{errors.customerCategory.message}</p>
              )}
            </div>

            {/* New or Existing */}
            <div>
              <label className={labelClass} htmlFor="customerType">
                New or Existing Customer <span className="text-negative">*</span>
              </label>
              <select
                id="customerType"
                className={selectClass}
                {...register('customerType', { required: 'Required' })}
              >
                <option value="">Select...</option>
                {CUSTOMER_TYPES.map((t) => (
                  <option key={`ctype-${t}`} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.customerType && (
                <p className={errorClass}>{errors.customerType.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section: Order Details — conditional on outcome */}
        {showOrderFields && (
          <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
            <div className="px-5 py-3 bg-accent/5 border-b border-accent/20">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-accent">
                Order Details
              </h3>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Product Category */}
              <div>
                <label className={labelClass} htmlFor="productCategory">
                  Product <span className="text-negative">*</span>
                </label>
                <select
                  id="productCategory"
                  className={selectClass}
                  {...register('productCategory', {
                    required: watchedOutcome === 'Order Placed' ? 'Select a product' : false,
                  })}
                >
                  <option value="">Select product...</option>
                  {productNames.map((p) => (
                    <option key={`prod-${p}`} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                {errors.productCategory && (
                  <p className={errorClass}>{errors.productCategory.message}</p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className={labelClass} htmlFor="quantity">
                  Quantity (units) <span className="text-negative">*</span>
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  step="1"
                  className={inputClass}
                  placeholder="0"
                  {...register('quantity', {
                    required: watchedOutcome === 'Order Placed' ? 'Quantity is required' : false,
                    valueAsNumber: true,
                    validate: (value) => {
                      if (watchedOutcome !== 'Order Placed') return true;
                      if (!Number.isFinite(value)) return 'Enter a valid number';
                      if (!Number.isInteger(value)) return 'Quantity must be a whole number';
                      if (value < 1) return 'Quantity must be at least 1';
                      if (value > 999999) return 'Quantity seems too large';
                      return true;
                    },
                  })}
                />
                {errors.quantity && (
                  <p className={errorClass}>{errors.quantity.message}</p>
                )}
              </div>

              {/* Unit Price */}
              <div>
                <label className={labelClass} htmlFor="unitPrice">
                  Unit Price (RWF) <span className="text-negative">*</span>
                </label>
                <input
                  id="unitPrice"
                  type="number"
                  min="1"
                  step="any"
                  className={inputClass}
                  placeholder="0"
                  {...register('unitPrice', {
                    required: watchedOutcome === 'Order Placed' ? 'Unit price is required' : false,
                    valueAsNumber: true,
                    validate: (value) => {
                      if (watchedOutcome !== 'Order Placed') return true;
                      if (!Number.isFinite(value)) return 'Enter a valid price';
                      if (value <= 0) return 'Unit price must be greater than 0';
                      if (value > 1_000_000_000) return 'Unit price seems too large';
                      return true;
                    },
                  })}
                />
                {errors.unitPrice && (
                  <p className={errorClass}>{errors.unitPrice.message}</p>
                )}
              </div>

              {/* Calculated Sales Value */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className={labelClass}>
                  Sales Value (RWF)
                </label>
                <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2.5">
                  <Calculator size={16} className="text-primary shrink-0" />
                  <span className="text-sm font-bold text-primary font-tabular">
                    {formatRWFFull(salesValue)}
                  </span>
                </div>
                <p className={helperClass}>Auto-calculated: Quantity × Unit Price</p>
              </div>

              {/* Payment Status */}
              <div>
                <label className={labelClass} htmlFor="paymentStatus">
                  Payment Status <span className="text-negative">*</span>
                </label>
                <select
                  id="paymentStatus"
                  className={selectClass}
                  {...register('paymentStatus', {
                    required: watchedOutcome === 'Order Placed' ? 'Select payment status' : false,
                  })}
                >
                  <option value="">Select status...</option>
                  {paymentStatuses.map((s) => (
                    <option key={`pay-${s}`} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.paymentStatus && (
                  <p className={errorClass}>{errors.paymentStatus.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section: Follow-up & Remarks */}
        <div className="bg-card border border-border rounded-xl overflow-hidden mb-5">
          <div className="px-5 py-3 bg-muted/40 border-b border-border">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Follow-up & Notes
            </h3>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Next Follow-up Date */}
            <div>
              <label className={labelClass} htmlFor="nextFollowUpDate">
                Next Follow-up Date
              </label>
              <input
                id="nextFollowUpDate"
                type="date"
                className={inputClass}
                min={todayStr}
                {...register('nextFollowUpDate', {
                  validate: (value) => {
                    if (!value) return true; // optional field
                    const selected = new Date(value);
                    const today = new Date(todayStr);
                    if (selected < today) return 'Follow-up date must be today or in the future';
                    return true;
                  },
                })}
              />
              <p className={helperClass}>
                Leave blank if no follow-up is needed
              </p>
              {errors.nextFollowUpDate && (
                <p className={errorClass}>{errors.nextFollowUpDate.message}</p>
              )}
            </div>

            {/* Remarks */}
            <div>
              <label className={labelClass} htmlFor="remarks">
                Remarks / Notes
              </label>
              <textarea
                id="remarks"
                rows={4}
                className={`${inputClass} resize-none`}
                placeholder="Any additional context about this visit..."
                {...register('remarks', {
                  maxLength: { value: 500, message: 'Remarks must be 500 characters or fewer' },
                })}
              />
              {errors.remarks && (
                <p className={errorClass}>{errors.remarks.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Required fields note */}
        <p className="text-[11px] text-muted-foreground mb-4">
          <span className="text-negative">*</span> Required fields
        </p>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting || submitSuccess}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-95 w-44 ${
              submitSuccess
                ? 'bg-positive text-white cursor-default' :'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Saving...
              </>
            ) : submitSuccess ? (
              <>
                <CheckCircle size={15} />
                Saved
              </>
            ) : (
              'Log Visit'
            )}
          </button>
          <button
            type="reset"
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground border border-border hover:bg-muted transition-colors"
            onClick={() => {
              reset();
              setSalesValue(0);
            }}
          >
            Clear Form
          </button>
        </div>
      </form>
    </>
  );
}