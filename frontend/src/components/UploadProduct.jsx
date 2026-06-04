import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import productCategory from '../helpers/productCategory';
import productDeal from '../helpers/productDeal';
import productSubCategory from '../helpers/productSubCategory';
import productStatus from '../helpers/productStatus';
import { FaCloudUploadAlt } from 'react-icons/fa';
import uploadImage from '../helpers/uploadImages';
import DisplayImage from './DisplayImage';
import { MdDelete } from 'react-icons/md';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import {
  adminModalOverlay,
  adminModalPanelLg,
  adminModalHeader,
  adminModalCloseBtn,
  adminModalFooter,
  adminInput,
  adminLabel,
} from '../common/adminUi';

const Field = ({ label, htmlFor, children }) => (
  <div>
    <label htmlFor={htmlFor} className={adminLabel}>
      {label}
    </label>
    {children}
  </div>
);

const UploadProduct = ({ onClose, fetchData }) => {
  const [data, setData] = useState({
    productName: '',
    brandName: '',
    category: '',
    subCategory: '',
    hotDeal: '',
    productImage: [],
    description: '',
    price: '',
    item: '',
    sellingPrice: '',
    productStatus: '',
  });

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState('');
  const [saving, setSaving] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => ({
      ...preve,
      [name]: value,
    }));
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploadImageCloudinary = await uploadImage(file);
      const imageUrl = uploadImageCloudinary.url;
      if (!imageUrl) {
        throw new Error('No image URL returned from upload');
      }
      setData((preve) => ({
        ...preve,
        productImage: [...preve.productImage, imageUrl],
      }));
      toast.success('Image uploaded');
    } catch (err) {
      const message = err?.message || 'Failed to upload image';
      toast.error(message);
    }
  };

  const handleDeleteProductImage = (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);
    setData((preve) => ({
      ...preve,
      productImage: [...newProductImage],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.productImage?.length) {
      toast.error('Please upload at least one product image');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...data,
        price: data.price === '' ? undefined : Number(data.price),
        sellingPrice: data.sellingPrice === '' ? undefined : Number(data.sellingPrice),
        item: data.item === '' ? undefined : Number(data.item),
      };

      const response = await fetch(SummaryApi.uploadProduct.url, {
        method: SummaryApi.uploadProduct.method,
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();

      if (responseData.success) {
        toast.success(responseData?.message);
        onClose();
        fetchData();
      } else if (responseData.error) {
        toast.error(responseData?.message);
      }
    } catch {
      toast.error('Failed to upload product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={adminModalOverlay}>
      <div className={adminModalPanelLg}>
        <div className={adminModalHeader}>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">
              Product catalog
            </p>
            <h2 className="mt-1 text-sm font-black uppercase tracking-widest">
              Upload product
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={adminModalCloseBtn}
            aria-label="Close"
          >
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            <Field label="Product name" htmlFor="productName">
              <input
                type="text"
                id="productName"
                placeholder="Enter product name"
                name="productName"
                value={data.productName}
                onChange={handleOnChange}
                className={adminInput}
                required
              />
            </Field>

            <Field label="Brand name" htmlFor="brandName">
              <input
                type="text"
                id="brandName"
                placeholder="Enter brand name"
                value={data.brandName}
                name="brandName"
                onChange={handleOnChange}
                className={adminInput}
                required
              />
            </Field>

            <Field label="Category" htmlFor="category">
              <select
                id="category"
                value={data.category}
                name="category"
                onChange={handleOnChange}
                className={adminInput}
              >
                <option value="">Select category</option>
                {productCategory.map((el, index) => (
                  <option value={el.value} key={el.value + index}>
                    {el.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Sub category" htmlFor="subCategory">
              <select
                id="subCategory"
                value={data.subCategory}
                name="subCategory"
                onChange={handleOnChange}
                className={adminInput}
              >
                <option value="">Select sub category</option>
                {productSubCategory.map((el, index) => (
                  <option value={el.value} key={el.value + index}>
                    {el.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Hot deal" htmlFor="hotDeal">
              <select
                id="hotDeal"
                value={data.hotDeal}
                name="hotDeal"
                onChange={handleOnChange}
                className={adminInput}
              >
                <option value="">Select deal</option>
                {productDeal.map((el, index) => (
                  <option value={el.value} key={el.value + index}>
                    {el.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Product image" htmlFor="uploadImageInput">
              <label htmlFor="uploadImageInput" className="block cursor-pointer">
                <div className="flex h-32 w-full items-center justify-center border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-orange-500">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <FaCloudUploadAlt className="text-3xl" />
                    <p className="text-[10px] font-black uppercase tracking-widest">
                      Upload product image
                    </p>
                    <input
                      type="file"
                      id="uploadImageInput"
                      className="hidden"
                      onChange={handleUploadProduct}
                    />
                  </div>
                </div>
              </label>
            </Field>

            <div>
              {data?.productImage[0] ? (
                <div className="flex flex-wrap items-center gap-3">
                  {data.productImage.map((el, index) => (
                    <div className="relative group" key={index}>
                      <img
                        src={el}
                        alt=""
                        width={80}
                        height={80}
                        className="cursor-pointer border-2 border-slate-200 bg-slate-50 object-cover transition hover:border-orange-500"
                        onClick={() => {
                          setOpenFullScreenImage(true);
                          setFullScreenImage(el);
                        }}
                      />
                      <button
                        type="button"
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center border-2 border-red-700 bg-red-50 text-red-700 transition hover:bg-red-700 hover:text-white"
                        onClick={() => handleDeleteProductImage(index)}
                        aria-label="Remove image"
                      >
                        <MdDelete className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] font-bold uppercase tracking-wide text-red-600">
                  * Please upload at least one product image
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Price" htmlFor="price">
                <input
                  type="number"
                  id="price"
                  placeholder="Enter price"
                  value={data.price}
                  name="price"
                  onChange={handleOnChange}
                  className={adminInput}
                />
              </Field>

              <Field label="Selling price" htmlFor="sellingPrice">
                <input
                  type="number"
                  id="sellingPrice"
                  placeholder="Enter selling price"
                  value={data.sellingPrice}
                  name="sellingPrice"
                  onChange={handleOnChange}
                  className={adminInput}
                />
              </Field>
            </div>

            <Field label="Items in stock" htmlFor="item">
              <input
                type="number"
                id="item"
                placeholder="Enter quantity"
                value={data.item}
                name="item"
                onChange={handleOnChange}
                className={adminInput}
              />
            </Field>

            <Field label="Description" htmlFor="description">
              <textarea
                id="description"
                className={`${adminInput} min-h-[7rem] resize-none`}
                placeholder="Enter product description"
                rows={3}
                onChange={handleOnChange}
                name="description"
                value={data.description}
              />
            </Field>

            <Field label="Product status" htmlFor="productStatus">
              <select
                id="productStatus"
                value={data.productStatus}
                name="productStatus"
                onChange={handleOnChange}
                className={adminInput}
              >
                <option value="">Select product status</option>
                {productStatus.map((el, index) => (
                  <option value={el.value} key={el.value + index}>
                    {el.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className={adminModalFooter}>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-slate-950 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-orange-600 disabled:opacity-60"
            >
              {saving ? 'Uploading…' : 'Upload product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border-2 border-slate-900 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {openFullScreenImage && (
        <DisplayImage
          onClose={() => setOpenFullScreenImage(false)}
          imgUrl={fullScreenImage}
        />
      )}
    </div>
  );
};

export default UploadProduct;
