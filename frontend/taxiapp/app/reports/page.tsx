"use client";
import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { getRides, deleteReport, createReport } from '@/app/queries/abm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FaArrowRight } from 'react-icons/fa';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ArrowLeft, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Report {
  id: string;
  title: string;
  description: string;
  lastLocation: string;
  date: string;
  rideId?: string;
}

interface Ride {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  report?: Report;
}

const PAGE_SIZE = 8;

const Reports: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [availableRides, setAvailableRides] = useState<Ride[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newReport, setNewReport] = useState<Report | null>(null);
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchRides = async () => {
      const session = await getSession();
      if (!session) {
        console.error('No session found');
        return;
      }
      const token = session.token;
      try {
        const ridesResponse = await getRides(token, page, PAGE_SIZE);
        const allRides = ridesResponse.content || [];
        setRides(allRides);
        setTotalPages(ridesResponse.page.totalPages);

        // Filtra los rides que no tienen ningún reporte asociado
        const availableRides = allRides.filter((ride: Ride) => !ride.report);
        setAvailableRides(availableRides);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRides();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
    setShowDetailView(true);
  };

  const handleBackToReports = () => {
    setShowDetailView(false);
    setSelectedReport(null);
  };

  const handleDeleteReport = async (reportId: string) => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }
    const token = session.token;
    try {
      await deleteReport(reportId, token);
      setRides(rides.map(ride => ride.report?.id === reportId ? { ...ride, report: undefined } : ride));
      setShowDetailView(false);
      setSelectedReport(null);
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  const handleCreateReport = () => {
    setShowCreateForm(true);
    setNewReport({
      id: '',
      title: '',
      description: '',
      lastLocation: '',
      date: new Date().toISOString().split('T')[0],
      rideId: undefined,
    });
  };

  const handleSaveNewReport = async () => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }
    const token = session.token;

    if (newReport && newReport.date) {
      const date = new Date(newReport.date);
      const formattedDate = date.toISOString();
      newReport.date = formattedDate;
    }
    console.log(newReport);
    try {
      const response = await createReport(newReport, token);
      setRides(rides.map(ride => ride.id === newReport?.rideId ? { ...ride, report: response } : ride));
      setShowCreateForm(false);
      setNewReport(null);
    } catch (error) {
      console.error('Error saving new report:', error);
    }
  };

  const handleCancelNewReport = () => {
    setShowCreateForm(false);
    setNewReport(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewReport(prevNewReport => (prevNewReport ? { ...prevNewReport, [name]: value } : null));
  };

  return (
    <div className='geist-sans-font bg-secondary flex justify-center'>
      <div className='table-container flex-col justify-center'>
        {showDetailView && selectedReport ? (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Reporte de Siniestro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-medium leading-none">Descripción</h3>
                <p className="text-sm text-muted-foreground">{selectedReport.description}</p>
              </div>
              <Separator />
              <div className="space-y-1">
                <h3 className="text-sm font-medium leading-none">Última Ubicación</h3>
                <p className="text-sm text-muted-foreground">{selectedReport.lastLocation}</p>
              </div>
              <Separator />
              <div className="space-y-1">
                <h3 className="text-sm font-medium leading-none">Fecha</h3>
                <p className="text-sm text-muted-foreground">{new Date(selectedReport.date).toLocaleDateString()}</p>
              </div>
              <Separator />
              <div className="space-y-1">
                <h3 className="text-sm font-medium leading-none">ID del Viaje</h3>
                <p className="text-sm font-mono text-muted-foreground">{rides.find(ride => ride.report?.id === selectedReport.id)?.id}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button className=' mx-2' variant="outline" onClick={handleBackToReports}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Reportes
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className='mx-2' variant="destructive" onClick={() => setSelectedReportId(selectedReport.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Esto eliminará permanentemente el reporte.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className='bg-secondary text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary'>Cancelar</AlertDialogCancel>
                    <AlertDialogAction className='bg-destructive hover:bg-red-600' onClick={() => selectedReportId && handleDeleteReport(selectedReportId)}>Confirmar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ) : showCreateForm ? (
          <div className='m-4 rounded-2xl bg-background shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] p-4'>
            <h2 className='text-xl font-bold mb-4'>Create New Report</h2>
            <div className='mb-4'>
              <label className='block text-primary-foreground text-sm font-bold mb-2' htmlFor='title'>Title</label>
              <input
                className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500'
                type='text'
                name='title'
                value={newReport?.title || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className='mb-4'>
              <label className='block text-primary-foreground text-sm font-bold mb-2' htmlFor='description'>Description</label>
              <Textarea
                className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-secondary leading-tight focus:outline-none focus:bg-white focus:border-yellow-500'
                name='description'
                value={newReport?.description || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className='mb-4'>
              <label className='block text-primary-foreground text-sm font-bold mb-2' htmlFor='lastLocation'>Last Location</label>
              <input
                className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-secondary leading-tight focus:outline-none focus:bg-white focus:border-yellow-500'
                type='text'
                name='lastLocation'
                value={newReport?.lastLocation || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className='mb-4'>
              <label className='block text-primary-foreground text-sm font-bold mb-2' htmlFor='rideId'>Ride</label>
              <select
                className='bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 text-secondary leading-tight focus:outline-none focus:bg-white focus:border-yellow-500'
                name='rideId'
                value={newReport?.rideId || ''}
                onChange={handleInputChange}
              >
                <option value=''>Select a ride</option>
                {availableRides.map(ride => (
                    <option className='text-secondary' key={ride.id} value={ride.id}>
                    {ride.id.slice(0, 4)} - {ride.pickup_location} - {ride.dropoff_location}
                    </option>
                ))}
              </select>
            </div>
            <div className='mb-4'>
              <label className='block text-primary-foreground text-sm font-bold mb-2' htmlFor='date'>Date</label>
              <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${!date ? "text-muted-foreground" : ""}`}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date || undefined}
                    onSelect={(day) => {
                      setDate(day || null);
                      setNewReport(prevNewReport => (prevNewReport ? { ...prevNewReport, date: day ? day.toISOString() : '' } : null));
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className='mt-4'>
              <Button onClick={handleSaveNewReport} className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded">Save</Button>
              <Button onClick={handleCancelNewReport} className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded ml-4">Cancel</Button>
            </div>
          </div>
        ) : (
          <div className='m-4 rounded-2xl bg-background shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
            <Button onClick={handleCreateReport} className="text-secondary bg-secondary-foreground shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] hover:bg-yellow-500 font-bold px-4 p-4 rounded mt-4 mx-4">
              + Create Report
            </Button>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Ride ID</TableHead>
                  <TableHead></TableHead> {/* Empty header for the arrow icon */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rides.map(ride => (
                  ride.report && (
                    <TableRow key={ride.report.id} onClick={() => ride.report && handleReportClick(ride.report)}>
                      <TableCell>{ride.report.title}</TableCell>
                      <TableCell>{new Date(ride.report.date).toLocaleString()}</TableCell>
                      <TableCell>{ride.id}</TableCell>
                      <TableCell className="text-right"><FaArrowRight /></TableCell>
                    </TableRow>
                  )
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {!showDetailView && !showCreateForm && totalPages > 1 && (
          <div className='pagination-container'>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={() => page > 0 && handlePageChange(page - 1)} />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink href="#" isActive={index === page} onClick={() => handlePageChange(index)}>
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext href="#" onClick={() => page < totalPages - 1 && handlePageChange(page + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;